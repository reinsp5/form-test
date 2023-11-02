<script lang="ts" setup>
const name = ref("");
const email = ref("");
const message = ref("");

const sendForm = () => {
  const { data, status } = useFetch("/api/sendMail", {
    method: "POST",
    body: {
      name: name.value,
      email: email.value,
      message: message.value,
    },
  });

  // 送信が成功したら完了ページへ、失敗したらエラーページへ遷移する
  if (status.value === "success") {
    navigateTo("/complete");
  } else {
    navigateTo("/error");
  }

};
</script>

<template>
  <div>
    <h1>お問い合わせ</h1>
    <form @submit.prevent="sendForm">
      <label for="name">お名前</label>
      <input type="text" id="name" />
      <label for="email">メールアドレス</label>
      <input type="email" id="email" />
      <label for="message">お問い合わせ内容</label>
      <textarea id="message"></textarea>
      <button type="submit">送信</button>
    </form>
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
