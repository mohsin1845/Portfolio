import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, projectType, message } = await request.json();

    const data = await resend.emails.send({
      from: "Mohsin Photography <onboarding@resend.dev>",
      to: process.env.NOTIFICATION_EMAIL || "mohsinmohiuddin85@gmail.com",
      subject: `New Booking: ${name}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Booking</title>
</head>
<body style="margin: 0; padding: 0; background: #000000; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <!-- Gold Accent Bar -->
  <div style="height: 4px; background: linear-gradient(90deg, #000000 0%, #d4af37 50%, #000000 100%);"></div>

  <!-- Main Container -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #000000; padding: 60px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px;">
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom: 40px;">
              <span style="font-size: 28px; font-weight: 300; letter-spacing: 0.4em; color: #d4af37; text-transform: uppercase;">
                Mohsin
              </span>
              <br>
              <span style="font-size: 10px; letter-spacing: 0.3em; color: #6b7280; text-transform: uppercase;">
                Visual Stories
              </span>
            </td>
          </tr>

          <!-- Content Card -->
          <tr>
            <td style="background: #0a0a0a; border: 1px solid #1f1f1f; border-radius: 16px; padding: 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <!-- Title -->
                <tr>
                  <td align="center" style="padding-bottom: 30px;">
                    <span style="font-size: 32px; font-weight: 600; background: linear-gradient(135deg, #d4af37 0%, #f6d776 50%, #d4af37 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                      NEW BOOKING
                    </span>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <div style="width: 60px; height: 1px; background: linear-gradient(90deg, transparent, #d4af37, transparent);"></div>
                  </td>
                </tr>

                <!-- Name -->
                <tr>
                  <td style="padding: 16px 0; border-bottom: 1px solid #1f1f1f;">
                    <span style="display: block; font-size: 11px; color: #d4af37; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 4px;">
                      Name
                    </span>
                    <span style="font-size: 18px; color: #ffffff;">
                      ${name}
                    </span>
                  </td>
                </tr>

                <!-- Email -->
                <tr>
                  <td style="padding: 16px 0; border-bottom: 1px solid #1f1f1f;">
                    <span style="display: block; font-size: 11px; color: #d4af37; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 4px;">
                      Email
                    </span>
                    <span style="font-size: 18px; color: #ffffff;">
                      ${email}
                    </span>
                  </td>
                </tr>

                <!-- Project Type -->
                <tr>
                  <td style="padding: 16px 0; border-bottom: 1px solid #1f1f1f;">
                    <span style="display: block; font-size: 11px; color: #d4af37; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 4px;">
                      Project Type
                    </span>
                    <span style="font-size: 18px; color: #ffffff;">
                      ${projectType || "Not specified"}
                    </span>
                  </td>
                </tr>

                <!-- Message -->
                <tr>
                  <td style="padding: 16px 0;">
                    <span style="display: block; font-size: 11px; color: #d4af37; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 8px;">
                      Message
                    </span>
                    <span style="font-size: 15px; color: #9ca3af; line-height: 1.6;">
                      ${message || "No message provided"}
                    </span>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td align="center" style="padding-top: 30px;">
                    <span style="font-size: 11px; color: #525252;">
                      This booking was received from your photography portfolio website
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
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