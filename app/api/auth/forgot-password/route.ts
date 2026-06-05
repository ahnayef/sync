import { NextResponse } from "next/server";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";
import crypto from "crypto";
import { sendMail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const [rows] = await db.execute<RowDataPacket[]>("SELECT id, email FROM users WHERE email = ?", [email]);
    if (!rows || rows.length === 0) {
      // Don't reveal whether the email exists
      return NextResponse.json({ success: true });
    }

    const user = rows[0];
    const code = String(100000 + Math.floor(Math.random() * 900000)); // 6-digit
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");

    await db.execute(
      "INSERT INTO password_resets (user_id, code_hash, expires_at, used) VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 1 HOUR), 0)",
      [user.id, codeHash]
    );

    // Send email with the code
    const subject = "Reset your Sync password";
    const text = `Sync password reset\n\nYour reset code is: ${code}\n\nThis code will expire in 1 hour. If you didn't request this, you can ignore this email.`;
    const html = `
      <div style="margin:0;padding:0;background:#0b1117;font-family:Arial,Helvetica,sans-serif;">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
          Use this code to reset your Sync password. It expires in 1 hour.
        </div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(180deg,rgba(79,142,247,0.14) 0%, rgba(11,17,23,0) 42%), #0b1117; padding:40px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
                <tr>
                  <td style="padding:0 0 18px 0; text-align:center;">
                    <div style="display:inline-block; width:52px; height:52px; line-height:52px; border-radius:16px; background:linear-gradient(135deg,#4f8ef7 0%, #6f6bf7 100%); color:#ffffff; font-size:20px; font-weight:700; box-shadow:0 12px 32px rgba(79,142,247,0.24);">S</div>
                  </td>
                </tr>
                <tr>
                  <td style="border:1px solid rgba(255,255,255,0.08); border-radius:24px; background:rgba(15,23,36,0.92); box-shadow:0 22px 70px rgba(0,0,0,0.38); overflow:hidden;">
                    <div style="height:6px; background:linear-gradient(90deg,#4f8ef7 0%, #6f6bf7 100%);"></div>
                    <div style="padding:34px 30px 30px 30px; color:#e9eef7; text-align:center;">
                      <div style="display:inline-block; padding:7px 12px; border-radius:999px; background:rgba(79,142,247,0.12); color:#8ab2ff; font-size:12px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase;">
                        Password Reset
                      </div>
                      <h1 style="margin:18px 0 10px 0; font-size:28px; line-height:1.15; color:#ffffff; font-weight:800; letter-spacing:-0.03em;">
                        Reset your Sync password
                      </h1>
                      <p style="margin:0 auto 24px auto; max-width:440px; font-size:15px; line-height:1.7; color:#b7c2d0;">
                        Use the one-time code below to continue resetting your password. It will expire in 1 hour for your security.
                      </p>

                      <div style="display:inline-block; margin:0 auto 20px auto; padding:18px 28px; border-radius:20px; background:linear-gradient(135deg, rgba(79,142,247,0.14), rgba(111,107,247,0.10)); border:1px solid rgba(138,178,255,0.20);">
                        <div style="font-size:12px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:#8ab2ff; margin-bottom:8px;">
                          Verification Code
                        </div>
                        <div style="font-size:34px; line-height:1; font-weight:900; letter-spacing:0.28em; color:#ffffff; font-family:'Courier New', Courier, monospace;">
                          ${code}
                        </div>
                      </div>

                      <div style="margin:18px 0 0 0; padding:16px; border-radius:18px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); text-align:left;">
                        <p style="margin:0; font-size:13px; line-height:1.6; color:#94a3b8;">
                          If you didn't request a password reset, you can safely ignore this email. Your account will remain unchanged.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 10px 0 10px; text-align:center; color:#6b7280; font-size:12px; line-height:1.6;">
                    <div style="margin-bottom:6px; color:#9fb2d4; font-weight:700;">Sync</div>
                    <div>Secure schedule management for your campus</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>`;

    await sendMail({ receiver: user.email, subject, text, html });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("forgot-password err:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
