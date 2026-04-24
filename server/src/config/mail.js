import nodemailer from "nodemailer";

const requiredEnvVars = ["MAIL_HOST", "MAIL_PORT", "MAIL_USER", "MAIL_PASS"];

export const getMissingMailEnvVars = () =>
  requiredEnvVars.filter((key) => !process.env[key]);

export const isMailConfigured = () => getMissingMailEnvVars().length === 0;

export const getMailTransporter = () => {
  const missingEnvVars = getMissingMailEnvVars();

  if (missingEnvVars.length > 0) {
    console.warn(
      `Mail transport is not configured. Missing: ${missingEnvVars.join(", ")}`
    );
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: process.env.MAIL_SECURE === "true",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
};
