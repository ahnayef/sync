import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const botToken = process.env.BOT_TOKEN;
    const chatId = process.env.CHAT_ID;

    if (!botToken || !chatId) {
      console.error("Telegram BOT_TOKEN or CHAT_ID is not configured in .env");
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    // Build the formatted Telegram message
    const text = `#sync\n\n 📬 *New Contact Message*\n\n👤 *Name:* ${name}\n✉️ *Email:* ${email}\n📌 *Subject:* ${subject}\n\n💬 *Message:*\n${message}`;

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "Markdown",
      }),
    });

    if (!response.ok) {
      const errPayload = await response.json();
      console.error("Telegram API response error:", errPayload);
      return NextResponse.json({ error: "Failed to forward message." }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form endpoint exception:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
