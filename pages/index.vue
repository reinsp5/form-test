<script lang="ts" setup></script>

<template>
  <form action="/api/sendForm" method="POST">
    <label for="name">氏名：</label>
    <input type="text" name="name" />
    <label for="email">メールアドレス：</label>
    <input type="text" name="email" />
    <label for="body"></label>
    <textarea name="message" id="" cols="30" rows="10"></textarea>
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
