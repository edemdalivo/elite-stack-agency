import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';

// On n'initialise Stripe QUE si la clé existe, sinon on met null
// Cela évite l'erreur "Neither apiKey nor config provided" pendant le build Vercel
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-01-27' as any })
  : null;

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  // Vérification de sécurité si Stripe n'est pas prêt
  if (!stripe) {
    console.error("STRIPE_SECRET_KEY is missing");
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event;

  // 1. SÉCURITÉ : VÉRIFICATION DE LA SIGNATURE STRIPE
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret!);
  } catch (err: any) {
    console.error("❌ Erreur de signature Stripe");
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // 2. TRAITEMENT LORSQUE LE PAIEMENT EST RÉUSSI
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const clientEmail = session.customer_details?.email;
    const clientName = session.customer_details?.name || "Cher Client / Dear Client";
    
    // Récupération du montant (Stripe envoie en centimes, ex: 450000)
    // On divise par 100 uniquement si tes produits Stripe sont configurés ainsi.
    const amountPaid = session.amount_total ? session.amount_total : 0; 
    const packageName = "Elite Stack International Pack";

    // 3. ENREGISTREMENT DANS TA BASE DE DONNÉES SUPABASE
    const { error: dbError } = await supabase.from('sales').insert([{
      email: clientEmail,
      amount: amountPaid, 
      package: packageName,
      status: 'paid'
    }]);

    if (!dbError) {
        console.log(`💰 Vente Stripe de ${amountPaid} enregistrée !`);

        // 4. DÉCLENCHEMENT DE L'EMAIL VIA TON API CENTRALE (/api/send)
        // La variable NEXT_PUBLIC_APP_URL que tu ajoutes dans Vercel sera utilisée ici
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://elite-stack-agency.vercel.app';

        try {
            // A. Email pour le Client (Template Bilingue + Support + 15-30 min)
            if (clientEmail) {
                await fetch(`${appUrl}/api/send`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: clientName,
                        email: clientEmail,
                        packageName: packageName,
                        isOrder: true, // Active le template de succès bilingue
                        subject: "Confirmation de Paiement / Payment Confirmation - Elite Stack"
                    }),
                });
            }

            // B. Notification pour Toi (Admin)
            // On réutilise l'API /api/send mais sans le flag isOrder pour que tu reçoives le format "Inquiry"
            await fetch(`${appUrl}/api/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: "SYSTÈME STRIPE",
                    email: "edemdalivo93@gmail.com",
                    subject: "💰 NOUVELLE VENTE STRIPE !",
                    content: `Bravo Edem ! Un nouveau paiement de ${amountPaid} FCFA a été reçu de ${clientName} (${clientEmail}). Vérifie ton ca sur le Dashboard`
                }),
            });

        } catch (mailErr) {
            console.error("Erreur lors de l'appel à l'API d'email:", mailErr);
        }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}