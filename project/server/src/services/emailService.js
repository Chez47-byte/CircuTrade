import { getMailTransporter, isMailConfigured } from "../config/mail.js";

const getFromAddress = () => {
  const fromName = process.env.MAIL_FROM_NAME || "CircuTrade";
  const fromAddress = process.env.MAIL_FROM_ADDRESS || process.env.MAIL_USER;
  return `"${fromName}" <${fromAddress}>`;
};

export const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = getMailTransporter();

  if (!isMailConfigured() || !transporter) {
    throw new Error("Email transport is not configured");
  }

  if (!to) {
    throw new Error("Recipient email is required");
  }

  return transporter.sendMail({
    from: getFromAddress(),
    to,
    subject,
    text,
    html,
  });
};
