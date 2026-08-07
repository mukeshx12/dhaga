type SendPasswordResetEmailInput = {
  to: string;
  resetUrl: string;
};

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character] ?? character
  );
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: SendPasswordResetEmailInput) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.PASSWORD_RESET_FROM_EMAIL?.trim();

  if (!apiKey || !from) {
    throw new Error(
      "RESEND_API_KEY and PASSWORD_RESET_FROM_EMAIL must be configured."
    );
  }

  const safeUrl = escapeHtml(resetUrl);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "Dhaga/1.0",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "Reset your Dhaga password",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1f2937">
          <h1 style="color:#92400e">Reset your Dhaga password</h1>
          <p>We received a request to reset the password for your Dhaga account.</p>
          <p style="margin:28px 0">
            <a href="${safeUrl}" style="background:#b45309;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:700">Reset password</a>
          </p>
          <p>This link expires in 15 minutes and can be used only once.</p>
          <p>If you did not request this, you can safely ignore this email.</p>
        </div>
      `,
      text: `Reset your Dhaga password: ${resetUrl}\n\nThis link expires in 15 minutes and can be used only once. If you did not request it, ignore this email.`,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;
    throw new Error(data?.message || `Email provider returned ${response.status}.`);
  }
}
