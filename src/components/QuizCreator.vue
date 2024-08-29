<template>
  <h3>Create Drag & Drop Picture here</h3>
  <div class="quiz-edit-container">
    <form action="" @submit.prevent="handleSubmit">
      <label for="#drag-drop-image-upload">
        Upload Image:
        <input
          id="drag-drop-image-upload"
          type="file"
          accept="image/*"
          @change="(event) => handleFileUpload(event)"
        />
        <TextImage @update-textimage-src="handleTxtImageSrcUpdate" />
      </label>
      <QuizEdit
        :image-url="imageSrc"
        @update-collect-position="handlePosition"
      />
      <!-- todo: Handle Submit data to database -->
      <input type="submit" value="Submit Quiz" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { QuizOption, DDquizFormData } from "@/type";
import QuizEdit from "./QuizEdit.vue";
import TextImage from "./TextImage.vue";
import { handleSubmitData } from "../dataAccessLayer.ts";

const imageSrc = ref();

const handleTxtImageSrcUpdate = (src: string) => {
  imageSrc.value = src;
  console.log(src);
};
const handleFileUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files;
  imageSrc.value = file ? URL.createObjectURL(file[0]) : undefined;
};

const handlePosition = (newPositions: QuizOption[]) => {
  collectPosition.value = newPositions;
};

const collectPosition = ref<QuizOption[]>([]);
const handleSubmit = () => {
  const formdata: DDquizFormData = {
    image: imageSrc.value,
    collectPosition: collectPosition.value,
  };
  handleSubmitData(formdata);
};
</script>

<style scoped>
.quiz-edit-container {
  margin: auto;
  width: 100%;
  margin-bottom: 2em;
}

input {
  margin-bottom: 2em;
  font-size: large;
  box-shadow: 5px 5px 5px rgb(223, 222, 222) inset;
}
textarea {
  width: 100%;
  resize: vertical;
}

button {
  margin-top: 10px;
}

img {
  margin-top: 20px;
  max-width: 100%;
}
</style>
