"use server";

import { smtpTransport } from "@/services/email/smtp";

export async function sendVerificationEmailSMTP({
  user,
  url,
}: {
  user: { name: string; email: string };
  url: string;
}) {
  console.log("🔔 Enviando email SMTP para:", user.email, "URL:", url);

  // const html = renderToStaticMarkup(
  //   VerifyEmail({ username: user.name, verifyUrl: url })
  // );

  const html = `
  <div style="font-family: Arial, sans-serif">
    <h2>Olá, ${user.name}</h2>
    <p>Obrigado por se registrar. Clique abaixo para verificar seu e-mail:</p>
    <a href="${url}" style="padding: 10px 20px; background: #2563eb; color: white; border-radius: 5px; text-decoration: none;">
      Verificar e-mail
    </a>
    <p>Se você não solicitou, ignore este e-mail.</p>
  </div>
`;

  try {
    await smtpTransport.sendMail({
      from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
      to: user.email,
      subject: "Verifique seu e-mail",
      html, // ✅ HTML puro gerado a partir do componente
    });
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail SMTP:", error);
  }
}
