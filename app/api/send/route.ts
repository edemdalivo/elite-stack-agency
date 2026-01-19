import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(request: Request) {
  try {
    const { name, email, content } = await request.json();

    const data = await resend.emails.send({
      from: 'Elite Stack Agency <onboarding@resend.dev>',
      to: ['edemdalivo93@gmail.com'],
      subject: `🚀 New Project Inquiry: ${name}`, // Sujet en anglais
      html: `
        <div style="font-family: sans-serif; color: #1a1a1a; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #3b82f6;">New Contact Message</h2>
          <p style="margin-bottom: 10px;">You have received a new inquiry from your website.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Client Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Project Details:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #3b82f6; font-style: italic;">
            ${content}
          </div>
          <footer style="margin-top: 20px; font-size: 12px; color: #888;">
            Sent from Elite Stack Agency International Portal
          </footer>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Email Error:", error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}