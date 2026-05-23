import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcryptjs";
import { sendMail } from "@/lib/mail";

const generatePassword = () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let pass = "";
  for (let i = 0; i < 12; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
};

const getEmailTemplate = (email: string, pass: string, loginUrl: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sync Moderator Invitation</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b1120; color: #f8fafc; margin: 0; padding: 40px 20px; line-height: 1.6; }
  .wrapper { max-width: 600px; margin: 0 auto; }
  .header { text-align: center; margin-bottom: 30px; }
  .logo { display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 14px; background: linear-gradient(135deg, #4f8ef7, #a371f7); background-color: #4f8ef7; color: white; font-size: 24px; font-weight: 800; text-decoration: none; box-shadow: 0 4px 20px rgba(79, 142, 247, 0.4); }
  .container { background-color: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 40px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
  h1 { font-size: 28px; font-weight: 700; margin: 0 0 16px; color: #ffffff; letter-spacing: -0.5px; }
  p { font-size: 16px; color: #94a3b8; margin: 0 0 24px; }
  .credentials-wrapper { background: linear-gradient(to right, rgba(79, 142, 247, 0.1), rgba(163, 113, 247, 0.1)); padding: 2px; border-radius: 16px; margin: 32px 0; }
  .credentials { background-color: #0f172a; border-radius: 14px; padding: 30px; }
  .credential-item { margin-bottom: 20px; }
  .credential-item:last-child { margin-bottom: 0; }
  .label { font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; margin-bottom: 6px; font-weight: 600; }
  .value { font-size: 18px; font-weight: 700; color: #f8fafc; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; background: #1e293b; padding: 12px 16px; border-radius: 8px; border: 1px solid #334155; display: inline-block; width: calc(100% - 34px); word-break: break-all; }
  .action-wrapper { text-align: center; margin-top: 40px; }
  .btn { display: inline-block; background: linear-gradient(135deg, #4f8ef7, #6f6bf7); background-color: #4f8ef7; color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 8px 24px rgba(79, 142, 247, 0.3); transition: all 0.2s ease; }
  .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #64748b; }
</style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">L</div>
    </div>
    <div class="container">
      <h1>Welcome to Sync</h1>
      <p>Hello there,</p>
      <p>An administrator has invited you to join the Sync dashboard as a <strong>Moderator</strong>. You now have privileged access to manage the institution's core resources including departments, teachers, courses, rooms, and the schedule.</p>
      
      <div class="credentials-wrapper">
        <div class="credentials">
          <div class="credential-item">
            <div class="label">Your Login Email</div>
            <div class="value">${email}</div>
          </div>
          <div class="credential-item">
            <div class="label">Temporary Password</div>
            <div class="value">${pass}</div>
          </div>
        </div>
      </div>
      
      <p style="font-size: 15px; text-align: center; color: #cbd5e1;">Please log in securely using the button below. We strongly recommend changing your password immediately after your first login.</p>
      
      <div class="action-wrapper">
        <a href="${loginUrl}" class="btn">Log in to Dashboard</a>
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Sync University System. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT id, name, email, created_at FROM users WHERE role = 'moderator' ORDER BY created_at DESC"
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Fetch moderators err:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const [existing] = await db.execute<RowDataPacket[]>("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }

    const tempPassword = generatePassword();
    const hashed = await bcrypt.hash(tempPassword, 10);

    await db.execute(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'moderator')",
      ["Moderator", email, hashed]
    );

    const loginUrl = new URL("/login", req.url).toString();
    const html = getEmailTemplate(email, tempPassword, loginUrl);

    const mailSent = await sendMail({
      receiver: email,
      subject: "Welcome to Sync - Moderator Invitation",
      text: `You have been invited as a moderator. Email: ${email}, Password: ${tempPassword}. Login at ${loginUrl}`,
      html,
    });

    if (!mailSent.success) {
      console.warn("Failed to send email to", email);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Add moderator err:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    await db.execute("DELETE FROM users WHERE id = ? AND role = 'moderator'", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete mod err:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
