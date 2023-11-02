export default defineEventHandler(async (event) => {
  const formData = await readBody(event);
  const config = useRuntimeConfig();
  const recipientEmail = config.ownerMailAddr; // 自分のメールアドレス
  const sender = config.senderName; // 自分の名前や会社名
  const senderEmail = config.senderMailAddr; // 送信に使うメールアドレス（ドメインが同じなら適当でも可）
  const name = formData.name; // フォームデータの中身
  const email = formData.email; // フォームデータの中身
  const message = formData.message; // フォームデータの中身

  const adminTemplate = `
  <html>
    <body>
      <h1>問い合わせ内容</h1>
      <hr />
      <h2>【お名前】</h2>
        ${name}様
      <h2>【メールアドレス】</h2>
        ${email}
      <h2>【お問い合わせ内容】</h2>
      <p>
        ${message}
      </p>
    </body>
  </html>
  `;

  const custTemplate = `
  <html>
    <body>
      <h1>お問い合わせありがとうございます</h1>
      <hr />
      ${name}様
      この度はお問い合わせいただきありがとうございます。<br>
      以下の内容を受け付けました。<br>
      <h2>【お問い合わせ内容】</h2>
      <p>
        ${message}
      </p>
      お問い合わせ内容を確認中です、しばらくお待ち下さい。
    </body>
  </html>
  `;

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
          type: "text/html",
          value: adminTemplate,
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
        subject: "お問い合わせ受付完了",
        content: [
          {
            type: "text/html",
            value: custTemplate,
          },
        ],
      }),
    });

    var response = (await toCustRes.json()) ?? "{}";
    console.log(
      `status: ${toCustRes.status} response: ${JSON.stringify(response)}`
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
