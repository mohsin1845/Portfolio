import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, projectType, message } = await request.json();

    const data = await resend.emails.send({
      from: "AKSHAT Photography <onboarding@resend.dev>",
      to: process.env.NOTIFICATION_EMAIL || "mohsinmohiuddin85@gmail.com",
      subject: `New Inquiry: ${projectType || "Contact"} - ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #0a0a0a; color: #fafafa; padding: 40px; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; letter-spacing: 0.3em; color: #d4af37; }
            .content { background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 12px; padding: 30px; }
            .label { color: #d4af37; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 5px; }
            .value { font-size: 16px; margin-bottom: 20px; }
            .message-box { background: rgba(0, 0, 0, 0.3); border-radius: 8px; padding: 20px; margin-top: 10px; }
            .message-text { color: #d1d5db; line-height: 1.6; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">AKSHAT</div>
            </div>
            <div class="content">
              <div class="label">New Inquiry Received</div>
              <div style="margin-bottom: 25px;"></div>

              <div class="label">Name</div>
              <div class="value">${name}</div>

              <div class="label">Email</div>
              <div class="value">${email}</div>

              <div class="label">Project Type</div>
              <div class="value">${projectType || "Not specified"}</div>

              <div class="label">Message</div>
              <div class="message-box">
                <div class="message-text">${message || "No message provided"}</div>
              </div>
            </div>
            <div class="footer">
              This email was sent from your photography portfolio website
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return Response.json(data);
  } catch (error) {
    console.error("Email error:", error);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}