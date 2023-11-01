export default defineEventHandler(async (event) => {
  const formData = await readFormData(event);
  const recipientEmail = "sk.reinsp5@gmail.com"; // 自分のメールアドレス
  const sender = "お試しフォーム太郎"; // 自分の名前や会社名
  const senderEmail = "no-replay@reinsp5.com"; // 送信に使うメールアドレス（ドメインが同じなら適当でも可）
  const name = formData.get("name"); // フォームデータの中身
  const email = formData.get("email"); // フォームデータの中身
  const message = formData.get("message"); // フォームデータの中身

  // お問い合わせ内容をサイト運営者に送信
  try {
    const toAdminRes = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: recipientEmail }],
          },
        ],
        from: { email: senderEmail, name: sender },
        subject: "お問い合わせがありました",
        content: [
          {
            type: "text/plain",
            value: `【お名前】\n${name}様\n【メールアドレス】\n${email}\n【お問い合わせ内容】\n${message}`,
          },
        ],
      }),
    });

    // お客様へ自動返信メール
    if (toAdminRes.ok) {
      await fetch("https://api.mailchannels.net/tx/v1/send", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email }],
            },
          ],
          from: { email: senderEmail, name: sender },
          subject: "お問い合わせありがとうございます",
          content: [
            {
              type: "text/plain",
              value: `${name}様\nこの度はお問い合わせいただきありがとうございます。(略)\n【お問い合わせ内容】\n${message}`,
            },
          ],
        }),
      });

      return "送信に成功しました！";
    }
    throw createError({
      statusCode: 500,
      statusMessage: "送信に失敗しました",
    });
  } catch (e) {
    console.error(e);
    throw createError({
      statusCode: 500,
      statusMessage: "送信に失敗しました",
    });
  }
});
