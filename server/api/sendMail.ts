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
  <!doctype html>
  <html lang="ja">
    <head>
      <meta charset="utf-8">
      <title>問い合わせ内容</title>
    </head>
    <body>
      <h2>問い合わせ内容</h2>
      <p>
        以下の内容で問い合わせがありました。
      </p>
      <h3>【お名前】</h3>
      <p>${name}様</p>
      <h3>【メールアドレス】</h3>
      <p>${email}</p>
      <h3>【お問い合わせ内容】</h3>
      <p>${message}</p>
      
        <div
        id="signature"
        style="
          font-family: Helvetica, sans-serif;
          font-size: 12px;
          max-width: 620px;
          margin: 10px;
          color: #000;
          border-top: 1px dashed #ccc;
          padding-top: 10px;
        "
      >
        <div style="display: inline-block; vertical-align: top">
          <div id="email_photo_preview" style="text-align: right"></div>
        </div>
        <div
          style="display: inline-block; vertical-align: top; padding: 0 0 0 5px"
        >
          <div>
            <div
              id="email_name_preview"
              style="font-size: 15px; font-weight: bold; padding: 0 0 5px 0"
            >
              藤本ゆうき
            </div>
            <div id="email_job_company_preview">
              <span id="email_job_preview">不動産業</span>,
              <span id="email_company_preview">藤本ゆうき不動産</span>
            </div>
          </div>
          <div style="padding: 0px">
            <div id="email_phone_preview">Phone: 123-456-7890</div>
            <div id="email_mobile_preview">Mobile: 090-1234-5678</div>
          </div>
          <div id="email_email_website_preview" style="padding: 5px 0 0 0">
            <span id="email_email_preview"
              ><a href="mailto:yuuki.fujimooto@fujimoto-reb.com"
                >yuuki.fujimooto@fujimoto-reb.com</a
              ></span
            >
            |
            <span id="email_website_preview"
              ><a href="https://fujimoto-reb.page.dev"
                >https://fujimoto-reb.page.dev</a
              ></span
            >
          </div>
          <div style="font-size: 10px; padding: 5px 0 0 0">
            <span id="email_address_preview"></span>
          </div>
          <div style="margin-top: 5px">
            <span id="email_facebook_preview"></span>
            <span id="email_linkedin_preview"></span>
            <span id="email_twitter_preview"></span>
            <span id="email_instagram_preview"></span>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;

  const custTemplate = `
  <!DOCTYPE html>
  <html lang="ja">
    <head>
      <meta charset="utf-8" />
      <title>お問い合わせ内容</title>
    </head>
    <body>
      <h2>お問い合わせありがとうございます</h2>
      <p>${name}様</p>
      <p>
        この度はお問い合わせいただきありがとうございます。<br />
        以下の内容を受け付けました。<br />
      </p>
      <h3>【お問い合わせ内容】</h3>
      <p>${message}</p>
      お問い合わせ内容を確認中です、しばらくお待ち下さい。<br />
      このメールは自動送信です。返信はできませんのでご了承ください。
  
      <div
        id="signature"
        style="
          font-family: Helvetica, sans-serif;
          font-size: 12px;
          max-width: 620px;
          margin: 10px;
          color: #000;
          border-top: 1px dashed #ccc;
          padding-top: 10px;
        "
      >
        <div style="display: inline-block; vertical-align: top">
          <div id="email_photo_preview" style="text-align: right"></div>
        </div>
        <div
          style="display: inline-block; vertical-align: top; padding: 0 0 0 5px"
        >
          <div>
            <div
              id="email_name_preview"
              style="font-size: 15px; font-weight: bold; padding: 0 0 5px 0"
            >
              藤本ゆうき
            </div>
            <div id="email_job_company_preview">
              <span id="email_job_preview">不動産業</span>,
              <span id="email_company_preview">藤本ゆうき不動産</span>
            </div>
          </div>
          <div style="padding: 0px">
            <div id="email_phone_preview">Phone: 123-456-7890</div>
            <div id="email_mobile_preview">Mobile: 090-1234-5678</div>
          </div>
          <div id="email_email_website_preview" style="padding: 5px 0 0 0">
            <span id="email_email_preview"
              ><a href="mailto:yuuki.fujimooto@fujimoto-reb.com"
                >yuuki.fujimooto@fujimoto-reb.com</a
              ></span
            >
            |
            <span id="email_website_preview"
              ><a href="https://fujimoto-reb.page.dev"
                >https://fujimoto-reb.page.dev</a
              ></span
            >
          </div>
          <div style="font-size: 10px; padding: 5px 0 0 0">
            <span id="email_address_preview"></span>
          </div>
          <div style="margin-top: 5px">
            <span id="email_facebook_preview"></span>
            <span id="email_linkedin_preview"></span>
            <span id="email_twitter_preview"></span>
            <span id="email_instagram_preview"></span>
          </div>
        </div>
      </div>
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
