<template>
  <div class="container">
    <div class="btn-container">
      <button @click="() => (showCreator = !showCreator)">
        Create D&D Quiz
      </button>
      <button @click="() => (showDraggableBox = !showDraggableBox)">
        Launch D&D Quiz
      </button>
    </div>

    <div v-if="showCreator" class="create-ddQuiz-container">
      <QuizCreator />
    </div>
    <hr />
    <div v-if="showDraggableBox" class="ddQuiz-container">
      <DraggableBox />
    </div>
  </div>
  <div>
    <TextquizCreator />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import DraggableBox from "./components/DraggableBox.vue";
import QuizCreator from "./components/QuizCreator.vue";
import TextquizCreator from "./components/TextquizCreator.vue";

const showCreator = ref(false);
const showDraggableBox = ref(false);
onMounted(() => {
  localStorage.clear();
});
</script>

<style scoped>
.btn-container {
  position: absolute;
  top: 0;
  left: 0;
}
button {
  color: rgb(211, 205, 205);
}
.ddQuiz-container {
  border: 2px solid grey;
}
.create-ddQuiz-container {
  border: 2px dashed grey;
}
</style>
