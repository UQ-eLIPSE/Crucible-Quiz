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
    <hr />
    <div v-if="showCreator" class="create-ddQuiz-container">
      <QuizCreator :questions="sampleQuizQuestion" />
    </div>
    <hr />
    <div v-if="showDraggableBox" class="ddQuiz-container">
      <DraggableBox
        :drag-question="sampleDatabase"
        :image-source="imageSource"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DraggableBox from "./components/DraggableBox.vue";
import QuizCreator from "./components/QuizCreator.vue";
import {
  sampleDatabase,
  sampleQuizQuestion,
  imageSource,
} from "./dataAccessLayer";

const showCreator = ref(false);
const showDraggableBox = ref(false);
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
.btn-container {
  top: 0;
  left: 0;
}
button {
  color: rgb(211, 205, 205);
}
.create-ddQuiz-container {
  display: flex;
  flex-direction: column;
  align-items: space-between;
  border: 2px dashed grey;
  min-height: 35em;
  min-width: 25em;
}
</style>
