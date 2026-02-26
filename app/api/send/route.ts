import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Initialisation de Resend avec ta clé API
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(request: Request) {
  try {
    // 1. Extraction des données envoyées par Stripe, FedaPay ou le formulaire de contact
    const body = await request.json();
    const { name, email, content, subject, isOrder, packageName } = body;

    // 2. Définition du destinataire (Le client si c'est une vente, Toi si c'est un message)
    const recipient = isOrder ? email : 'edemdalivo93@gmail.com';

    // 3. Construction du contenu HTML (Template conditionnel)
    const htmlContent = isOrder ? `
      /* --- TEMPLATE DE CONFIRMATION DE COMMANDE (ELITE) --- */
      <div style="font-family: sans-serif; color: #1a1a1a; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 30px; border-radius: 10px;">
        <h2 style="color: #3b82f6; text-transform: uppercase;">Confirmation de commande / Order Confirmation</h2>
        <p>Merci / Thank you <strong>${name}</strong> !</p>
        
        <p><strong>FR:</strong> Votre paiement pour <strong>${packageName}</strong> est validé. Vos accès seront activés d'ici <strong>15 à 30 minutes</strong>.</p>
        <p><strong>EN:</strong> Your payment for <strong>${packageName}</strong> is confirmed. Your access will be activated within <strong>15 to 30 minutes</strong>.</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        
        <p style="margin-bottom: 5px;"><strong>💬 BESOIN D'AIDE IMMÉDIATE ? Voici le support/contact :</strong></p>
        <p style="margin-top: 0; color: #666; font-size: 13px;"><em>NEED IMMEDIATE HELP? Here is the support/contact:</em></p>
        
        <ul style="list-style: none; padding: 0;">
          <li style="margin-bottom: 10px;">✅ <strong>WhatsApp (Direct) :</strong> <a href="https://wa.me/22893591643" style="color: #25D366; text-decoration: none;">https://wa.me/22893591643</a></li>
          <li>✅ <strong>Email :</strong> <a href="mailto:edemdalivo93@gmail.com" style="color: #3b82f6; text-decoration: none;">edemdalivo93@gmail.com</a></li>
        </ul>
        
        <footer style="margin-top: 25px; font-size: 10px; color: #999; text-align: center;">
          Elite Stack Agency International Portal
        </footer>
      </div>
    ` : `
      /* --- TEMPLATE FORMULAIRE DE CONTACT --- */
      <div style="font-family: sans-serif; color: #1a1a1a; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #3b82f6;">🚀 New Project Inquiry</h2>
        <p><strong>Client Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #3b82f6; font-style: italic;">
          ${content}
        </div>
        <footer style="margin-top: 20px; font-size: 10px; color: #888;">
          Sent from Elite Stack Agency Portal
        </footer>
      </div>
    `;

    // 4. Envoi effectif de l'email via Resend
    const data = await resend.emails.send({
      from: 'Elite Stack Agency <onboarding@resend.dev>',
      to: [recipient],
      subject: subject || `🚀 Elite Stack Update`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Email Error:", error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}