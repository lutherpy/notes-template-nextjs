"use server";

import { smtpTransport } from "@/services/email/smtp";

export async function sendResetPasswordEmailSMTP({
  user,
  url,
}: {
  user: { name: string; email: string };
  url: string;
}) {
  console.log(
    "🔔 Enviando e-mail de redefinição de senha para:",
    user.email,
    "URL:",
    url
  );

  const html = `
    <div style="font-family: Arial, sans-serif">
      <h2>Olá, ${user.name}</h2>
      <p>Recebemos uma solicitação para redefinir sua senha. Clique abaixo para continuar:</p>
      <a href="${url}" style="padding: 10px 20px; background: #2563eb; color: white; border-radius: 5px; text-decoration: none;">
        Redefinir senha
      </a>
      <p>Se você não solicitou essa redefinição, pode ignorar este e-mail com segurança.</p>
    </div>
  `;

  try {
    await smtpTransport.sendMail({
      from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
      to: user.email,
      subject: "Redefinição de senha",
      html,
    });
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail de redefinição de senha:", error);
  }
}
