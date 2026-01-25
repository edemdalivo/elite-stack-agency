import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const event = body.event; 
    const transaction = body.entity;

    console.log(`Événement reçu : ${event}`); // Utile pour voir dans les logs Vercel

    // 🛡️ LOGIQUE DE TEST : On accepte 'approved' ET 'declined'
    if (event === 'transaction.approved' || event === 'transaction.declined') {
      
      const { error } = await supabase
        .from('sales')
        .insert([{ 
          email: transaction.customer.email, 
          amount: transaction.amount, 
          package: transaction.description, 
          status: event === 'transaction.approved' ? 'paid' : 'failed' 
        }]);

      if (error) {
        console.error("Erreur Supabase:", error.message);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }

      console.log(`✅ SYNCHRO RÉUSSIE : ${transaction.customer.email} enregistré avec le statut ${event}`);
      return NextResponse.json({ message: 'Success' }, { status: 200 });
    }

    return NextResponse.json({ message: 'Événement ignoré' }, { status: 200 });

  } catch (err) {
    console.error('Erreur Webhook:', err);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}