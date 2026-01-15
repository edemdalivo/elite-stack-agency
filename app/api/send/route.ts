import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(request: Request) {
  try {
    const { name, email, content } = await request.json();

    const data = await resend.emails.send({
      from: 'Elite Stack Agency <onboarding@resend.dev>',
      to: ['edemdalivo93@gmail.com'],
      subject: `🚀 Nouveau projet de ${name}`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2>Nouveau message de contact</h2>
          <p><strong>Nom :</strong> ${name}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Message :</strong></p>
          <div style="background: #f4f4f4; p: 15px; border-left: 4px solid #3b82f6;">
            ${content}
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur envoi' }, { status: 500 });
  }
}