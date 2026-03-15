import { Resend } from "resend";
import { NextRequest } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  hearAbout: string[];
  referralName: string;
  location: string;
  workRhythm: string;
  aboutWork: string;
  drawsYou: string[];
  mostInterested: string[];
  whyMember: string;
  investingHealth: string;
  hopingToChange: string;
  beginMembership: string;
  bestTimeToReach: string;
  anythingElse: string;
}

function buildEmailHtml(d: ApplicationData): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
      <div style="background: #000; padding: 32px; text-align: center;">
        <h1 style="color: #fff; font-size: 20px; font-weight: 400; letter-spacing: 0.05em; margin: 0;">NEW MEMBERSHIP APPLICATION</h1>
      </div>

      <div style="padding: 32px; background: #fafafa;">
        <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; color: #888; margin: 0 0 16px;">About the Applicant</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #888; width: 140px;">Name</td><td style="padding: 8px 0; font-weight: 500;">${d.firstName} ${d.lastName}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Email</td><td style="padding: 8px 0;"><a href="mailto:${d.email}" style="color: #000;">${d.email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Phone</td><td style="padding: 8px 0;"><a href="tel:${d.phone}" style="color: #000;">${d.phone}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #888;">How they heard</td><td style="padding: 8px 0;">${d.hearAbout.join(", ")}</td></tr>
          ${d.referralName ? `<tr><td style="padding: 8px 0; color: #888;">Referral</td><td style="padding: 8px 0;">${d.referralName}</td></tr>` : ""}
        </table>
      </div>

      <div style="padding: 32px;">
        <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; color: #888; margin: 0 0 16px;">Location & Work</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #888; width: 140px;">Location</td><td style="padding: 8px 0;">${d.location}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Work Rhythm</td><td style="padding: 8px 0;">${d.workRhythm}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">About Work</td><td style="padding: 8px 0;">${d.aboutWork}</td></tr>
        </table>
      </div>

      <div style="padding: 32px; background: #fafafa;">
        <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; color: #888; margin: 0 0 16px;">Interests</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #888; width: 140px;">Draws them</td><td style="padding: 8px 0;">${d.drawsYou.join(", ")}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Most interested</td><td style="padding: 8px 0;">${d.mostInterested.join(", ")}</td></tr>
        </table>
      </div>

      <div style="padding: 32px;">
        <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; color: #888; margin: 0 0 16px;">Vision</h2>
        <p style="margin: 0 0 12px;"><strong>Why become a member:</strong><br/>${d.whyMember}</p>
        <p style="margin: 0 0 12px;"><strong>Investing in health means:</strong><br/>${d.investingHealth}</p>
        <p style="margin: 0;"><strong>Hoping to change:</strong><br/>${d.hopingToChange}</p>
      </div>

      <div style="padding: 32px; background: #fafafa;">
        <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; color: #888; margin: 0 0 16px;">Final Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #888; width: 140px;">Begin membership</td><td style="padding: 8px 0;">${d.beginMembership}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Best time to reach</td><td style="padding: 8px 0;">${d.bestTimeToReach}</td></tr>
          ${d.anythingElse ? `<tr><td style="padding: 8px 0; color: #888;">Additional notes</td><td style="padding: 8px 0;">${d.anythingElse}</td></tr>` : ""}
        </table>
      </div>

      <div style="padding: 24px 32px; background: #000; color: #666; font-size: 12px; text-align: center;">
        Bluprint Wellness — 137 Lomas Santa Fe Drive, Solana Beach, CA 92075
      </div>
    </div>
  `;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as ApplicationData;

    // Basic validation
    if (!body.firstName || !body.lastName || !body.email) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: "Bluprint Wellness <applications@bluprintwellness.com>",
      to: [process.env.APPLICATION_EMAIL || "jonathan@bluprintwellness.com"],
      replyTo: body.email,
      subject: `Membership Application — ${body.firstName} ${body.lastName}`,
      html: buildEmailHtml(body),
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("API error:", err);
    return Response.json({ error: "Failed to send application" }, { status: 500 });
  }
}
