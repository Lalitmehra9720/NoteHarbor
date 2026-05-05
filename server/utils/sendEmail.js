import nodemailer from "nodemailer";

const getEmailConfig = () => {
  const user = process.env.EMAIL_USER || process.env.GMAIL_USER || process.env.SMTP_USER;
  const appPassword =
    process.env.EMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD;
  const password = appPassword?.replace(/\s/g, "") || process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM || process.env.SMTP_FROM || user;

  return { user, password, from };
};

const createTransporter = ({ user, password }) =>
  process.env.SMTP_HOST
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_PORT === "465",
        auth: {
          user,
          pass: password,
        },
      })
    : nodemailer.createTransport({
        service: "gmail",
        auth: {
          user,
          pass: password,
        },
      });

const sendEmail = async ({ to, subject, html }) => {
  const { user, password, from } = getEmailConfig();

  if (!user || !password) {
    throw new Error("Email credentials are not configured");
  }

  const transporter = createTransporter({ user, password });

  await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
};

export default sendEmail;
