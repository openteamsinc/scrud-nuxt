<template>
  <div class="form col">
    <slot></slot>
  </div>
</template>

<script>
  export default {
  }
</script>

<style>
.form {
  width: 50%;
  margin-left: 25%;
  margin-right: 25%;
  border: 1px solid rgb(70, 70, 70);
  border-radius: 8px;
  margin-top: 10px;
}
</style>