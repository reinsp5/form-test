export default defineEventHandler(async (event) => {
  const formData = await readBody(event);
  const config = useRuntimeConfig();
  const recipientEmail = config.ownerMailAddr; // 自分のメールアドレス
  const sender = config.senderName; // 自分の名前や会社名
  const senderEmail = config.senderMailAddr; // 送信に使うメールアドレス（ドメインが同じなら適当でも可）
  const name = formData.name; // フォームデータの中身
  const email = formData.email; // フォームデータの中身
  const message = formData.message; // フォームデータの中身

  // お問い合わせ内容をサイト運営者に送信する
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
          value: `【お名前】\n${name}様\n\n【メールアドレス】\n${email}\n\n【お問い合わせ内容】\n${message}`,
        },
      ],
    }),
  });

  var response = (await toAdminRes.json()) ?? "{}";
  console.log(
    `status: ${toAdminRes.status} response: ${JSON.stringify(response)}`
  );

  // お客様へ自動返信メールを送信する
  if (toAdminRes.ok) {
    const toCustRes = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: email, name: name }],
            dkim_domain: config.public.domain,
            dkim_selector: "mailchannels",
            dkim_private_key: `${config.dkimPrivateKey}`,
          },
        ],
        from: { email: senderEmail, name: sender },
        subject: "お問い合わせありがとうございます！",
        content: [
          {
            type: "text/plain",
            value: `${name}様\nこの度はお問い合わせいただきありがとうございます。(略)\n【お問い合わせ内容】\n${message}`,
          },
        ],
      }),
    });

    var response = (await toAdminRes.json()) ?? "{}";
    console.log(
      `status: ${toAdminRes.status} response: ${JSON.stringify(response)}`
    );

    // メール送信に成功したら、JSONを返す
    if (toCustRes.ok) {
      const response = JSON.stringify({
        message: "メールを送信しました",
      });
      return response;
    }
  }

  // メール送信に失敗したら、エラーを返す
  throw createError({
    statusCode: 500,
    statusMessage: "メールの送信に失敗しました",
  });
});
