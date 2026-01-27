import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend'; // 1. Ajout de l'import

const resend = new Resend(process.env.RESEND_API_KEY); // 2. Initialisation

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Webhook reçu !");

    const eventName = body.name; 
    const transaction = body.entity;

    // Récupération de l'email et du nom depuis les métadonnées
    const customerEmail = transaction.metadata?.paid_customer?.email || "edemdalivo90@gmail.com";
    const customerName = transaction.metadata?.paid_customer?.firstname || "Cher Client";

    console.log(`Événement détecté : ${eventName}`);

    if (eventName === 'transaction.approved' || eventName === 'transaction.declined') {
      
      const { error } = await supabase
        .from('sales')
        .insert([{ 
          email: customerEmail, 
          amount: transaction.amount, 
          package: transaction.description, 
          status: eventName === 'transaction.approved' ? 'paid' : 'failed' 
        }]);

      if (error) {
        console.error("Erreur Supabase détaillée:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }

      console.log(`✅ SUCCÈS : ${customerEmail} enregistré dans Supabase !`);

      // 3. LOGIQUE D'EMAIL (Uniquement si le paiement est RÉUSSI)
      if (eventName === 'transaction.approved' || eventName === 'transaction.declined') {
        try {
          // EMAIL POUR LE CLIENT (Accusé de réception + Contacts)
          await resend.emails.send({
            from: 'Elite Stack Agency <onboarding@resend.dev>',
            to: customerEmail,
            subject: 'Confirmation de votre commande - Elite Stack',
            html: `
              <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                <h2>Merci ${customerName} !</h2>
                <p>Votre commande pour le <strong>${transaction.description}</strong> a bien été reçue.</p>
                <p>Notre équipe vous contactera sous 24h pour démarrer votre projet.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p><strong>Besoin d'aide immédiate ? Contactez-nous :</strong></p>
                <ul style="list-style: none; padding: 0;">
                  <li style="margin-bottom: 15px;">✅ <strong>WhatsApp :</strong> <a href="https://wa.me/+22893591643" style="color: #25D366; text-decoration: none;">+228 93 59 16 43</a></li>
                  <li style="margin-bottom: 15px;">📧 <strong>Email :</strong> <a href="mailto:edemdalivo93@gmail.com" style="color: #007bff; text-decoration: none;">edemdalivo93@gmail.com</a></li>
                  <li style="margin-bottom: 15px;">📞 <strong>Appel direct :</strong> +228 93 59 16 43</li>
                </ul>
              </div>
            `
          });

          // EMAIL POUR TOI (Alerte Admin)
          await resend.emails.send({
            from: 'Elite Stack Alert <onboarding@resend.dev>',
            to: 'edemdalivo93@gmail.com',
            subject: '💰 NOUVELLE VENTE RÉUSSIE !',
            html: `
              <h2>Bravo Edem !</h2>
              <p>Tu viens de recevoir <strong>${transaction.amount} F CFA</strong>.</p>
              <p><strong>Client :</strong> ${customerName} (${customerEmail})</p>
              <p><strong>Produit :</strong> ${transaction.description}</p>
              <p>Go ! 🚀</p>
            `
          });
          console.log("Emails envoyés avec succès !");
        } catch (emailError) {
          console.error("Erreur lors de l'envoi des emails:", emailError);
          // On ne bloque pas la réponse car la transaction est déjà en DB
        }
      }

      return NextResponse.json({ message: 'Success' }, { status: 200 });
    }

    return NextResponse.json({ message: 'Événement ignoré' }, { status: 200 });

  } catch (err) {
    console.error('Erreur Webhook:', err);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}