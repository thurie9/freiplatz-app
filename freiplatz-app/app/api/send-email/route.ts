import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();

    const {
      to,
      subject,
      message,
    } = body;

    const data = await resend.emails.send({
      from:
        "Freiplatz <onboarding@resend.dev>",

      to,

      subject,

      html: `
        <h2>${subject}</h2>
        <p>${message}</p>
      `,
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({
      error,
    });
  }
}