import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);
const WEBHOOK_SECRET = process.env.FEDAPAY_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    // 1. RÉCUPÉRATION ET VÉRIFICATION DE SÉCURITÉ
    const bodyText = await req.text();
    const sig = req.headers.get('x-fedapay-signature');

    if (!sig || !WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const expectedSig = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(bodyText)
      .digest('hex');

    if (sig !== expectedSig) {
      console.error("❌ Signature FedaPay invalide");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 2. PARSING DES DONNÉES
    const body = JSON.parse(bodyText);
    const eventName = body.name; 
    const transaction = body.entity;

    // Extraction des infos client (Métadonnées FedaPay)
    const customerEmail = transaction.metadata?.paid_customer?.email || "client@email.com";
    const customerName = transaction.metadata?.paid_customer?.firstname || "Cher Client";
    const packageName = transaction.description || "Pack Elite Stack";

    // 3. TRAITEMENT SI LE PAIEMENT EST APPROUVÉ
    if (eventName === 'transaction.approved') {
      
      // A. Enregistrement dans la base de données Supabase
      const { error: dbError } = await supabase
        .from('sales')
        .insert([{ 
          email: customerEmail, 
          amount: transaction.amount, 
          package: packageName, 
          status: 'paid' 
        }]);

      if (dbError) {
        console.error("Erreur DB Supabase:", dbError);
      }

      // B. Envoi de l'Email au Client via ton API centrale (/api/send)
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://elite-stack-agency.vercel.app';
      
      try {
        await fetch(`${appUrl}/api/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: customerName,
            email: customerEmail,
            packageName: packageName,
            isOrder: true, // Active le template bilingue avec 15-30min
            subject: "🚀 Vos accès Elite Stack / Your Elite Stack Access"
          }),
        });

        // C. Notification Admin (Toi) pour te motiver (Objectif 100k)
        await resend.emails.send({
          from: 'Elite Stack Alert <onboarding@resend.dev>',
          to: 'edemdalivo93@gmail.com',
          subject: `💰 VENTE FEDAPAY : ${transaction.amount} CFA`,
          html: `
            <div style="font-family: sans-serif;">
              <h3>Bravo Edem ! Nouvelle vente encaissée.</h3>
              <p><strong>Client :</strong> ${customerName} (${customerEmail})</p>
              <p><strong>Produit :</strong> ${packageName}</p>
              <p><strong>Montant :</strong> ${transaction.amount} CFA</p>
              <p>Vérifie ton Dashboard Admin pour voir l'évolution de ton CA.</p>
            </div>
          `
        });

      } catch (mailErr) {
        console.error("Erreur lors du cycle d'envoi d'emails:", mailErr);
      }

      return NextResponse.json({ message: 'Transaction traitée avec succès' }, { status: 200 });
    }

    return NextResponse.json({ message: 'Evénement ignoré' }, { status: 200 });

  } catch (err) {
    console.error('Erreur Critique Webhook FedaPay:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}