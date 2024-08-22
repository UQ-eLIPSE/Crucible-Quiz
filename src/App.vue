<script setup lang="ts">
import DraggableBox from "./components/DraggableBox.vue";
import QuizCreator from "./components/QuizCreator.vue";
</script>

<template>
  <div class="container">
    <QuizCreator />
    <hr />

    <DraggableBox />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
</style>
