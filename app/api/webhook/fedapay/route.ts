import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const event = body.event; // L'événement (ex: transaction.approved)
    const transaction = body.entity; // Les détails du paiement

    // 🛡️ LOGIQUE FULL-STACK : On n'enregistre que si le paiement est validé
    if (event === 'transaction.approved') {
      
      const { error } = await supabase
        .from('sales')
        .insert([{ 
          email: transaction.customer.email, 
          amount: transaction.amount, 
          package: transaction.description, // Ex: "Paiement Pack Argent"
          status: 'paid'
        }]);

      if (error) {
        console.error("Erreur d'écriture Supabase:", error.message);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }

      console.log(`💰 VENTE VALIDÉE : ${transaction.amount} F CFA reçus de ${transaction.customer.email}`);
      return NextResponse.json({ message: 'Transaction enregistrée' }, { status: 200 });
    }

    return NextResponse.json({ message: 'Événement ignoré' }, { status: 200 });

  } catch (err) {
    console.error('Erreur Webhook:', err);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}