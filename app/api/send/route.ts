import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Cette version permet au build de Vercel de passer sans erreur
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(request: Request) {
  try {
    const { name, email, content } = await request.json();

    const data = await resend.emails.send({
      from: 'Elite Stack Agency <onboarding@resend.dev>',
      to: ['edemdalivo93@gmail.com'],
      subject: `🚀 Nouveau projet de ${name}`,
      html: `
        <h2>Nouveau message reçu !</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong></p>
        <p>${content}</p>
      `
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}