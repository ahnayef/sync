import nodemailer from 'nodemailer';

interface MailOptions {
    receiver: string;
    subject: string;
    text: string;
    html: string;
}

// Create a reusable transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
    // Improve connection reliability
    pool: true,
    maxConnections: 5
});

/**
 * Sends an email using configured Gmail account
 * @param options Email details including recipient, subject, and content
 * @returns Promise with success status and optional messageId
 */
export const sendMail = async (options: MailOptions): Promise<{ success: boolean; messageId?: string }> => {
    try {
        console.log('Sending email to:', options.receiver);
        const info = await transporter.sendMail({
            from: `"Sync" <${process.env.GMAIL_USER}>`,
            to: options.receiver,
            subject: options.subject,
            text: options.text,
            html: options.html,
        });

        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false };
    }
}