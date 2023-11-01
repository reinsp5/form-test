<script lang="ts" setup>
const name = ref("");
const email = ref("");
const message = ref("");

const sendForm = async () => {
  const formData = new FormData();

  const { data } = await useFetch("/api/sendForm", {
    method: "POST",
    body: {
      name: name.value,
      email: email.value,
      message: message.value,
    },
  });

  console.log(data.value);
};
</script>

<template>
  <form @submit.prevent="sendForm">
    <label for="name">氏名：</label>
    <input type="text" name="name" v-model="name" />
    <label for="email">メールアドレス：</label>
    <input type="text" name="email" v-model="email" />
    <label for="message"></label>
    <textarea
      name="message"
      id=""
      cols="30"
      rows="10"
      v-model="message"
    ></textarea>
    <button type="submit">送信</button>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  height: 100vh;
}
</style>
