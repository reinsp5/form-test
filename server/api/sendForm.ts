export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const recipientEmail = "sk.reinsp5@gmail.com"; // 自分のメールアドレス
  const sender = "お試しフォーム太郎"; // 自分の名前や会社名
  const senderEmail = "no-replay@reinsp5.com"; // 送信に使うメールアドレス（ドメインが同じなら適当でも可）
  const name = body.name; // フォームデータの中身
  const email = body.email; // フォームデータの中身
  const message = body.message; // フォームデータの中身

  try {
    // お問い合わせ内容をサイト運営者に送信
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

    console.log(toAdminRes.json());

    // お客様へ自動返信メール
    if (toAdminRes.ok) {
      console.log("お客様へ自動返信メール")
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
  } catch (error) {
    console.log("例外発生")
    console.log(`${error}`);
    throw createError({
      statusCode: 500,
      message: `${error}`,
    });
  }

  console.log("送信失敗。")
  throw createError({
    statusCode: 500,
    message: "送信に失敗しました",
  });
});
