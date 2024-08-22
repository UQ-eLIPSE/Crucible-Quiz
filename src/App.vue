<template>
  <div class="container">
    <button @click="() => (showCreator = !showCreator)">
      Land Quiz Editor
    </button>
    <div v-if="showCreator">
      <QuizCreator />
    </div>
    <hr />
    <button @click="() => (showDraggableBox = !showDraggableBox)">
      Land Quiz
    </button>
    <div v-if="showDraggableBox">
      <DraggableBox />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DraggableBox from "./components/DraggableBox.vue";
import QuizCreator from "./components/QuizCreator.vue";

const showCreator = ref(false);
const showDraggableBox = ref(false);
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
button {
  color: white;
}
</style>
