<script setup lang="ts">
import DraggableBox from "./components/DraggableBox.vue"
import QuizCreator from "./components/QuizCreator.vue"
</script>

<template>
  <div>
    <DraggableBox />
  </div>
  <div>
    Create Drag & Drop Picture here
    <QuizCreator />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>./components/QuizCreator.vue
