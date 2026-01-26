import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Webhook reçu !");

    // 🎯 Extraction précise selon ton log
    const eventName = body.name; 
    const transaction = body.entity;

    // Récupération de l'email (on cherche dans metadata si customer est vide)
    const customerEmail = transaction.metadata?.paid_customer?.email || "email-inconnu@test.com";

    console.log(`Événement détecté : ${eventName}`);

    // ✅ On accepte les deux pour le test
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
      return NextResponse.json({ message: 'Success' }, { status: 200 });
    }

    return NextResponse.json({ message: 'Événement ignoré' }, { status: 200 });

  } catch (err) {
    console.error('Erreur Webhook:', err);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}