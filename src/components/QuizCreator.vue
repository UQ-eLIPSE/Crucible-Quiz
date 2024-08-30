<template>
  <h3>Drag & Drop Question Form</h3>
  <div class="quiz-edit-container">
    <div>
      <p>Choose Question Type</p>

      <input type="radio" id="image-dd-quiz" value="Image" v-model="quizType" />
      <label for="image-dd-quiz">Image D&D Question</label>
      <input type="radio" id="text-dd-quiz" value="Text" v-model="quizType" />
      <label for="text-dd-quiz">Text D&D Question</label>
    </div>
    <form action="" @submit.prevent="handleSubmit">
      <label for="drag-drop-image-upload" v-if="quizType == 'Image'">
        Upload:
        <input
          id="drag-drop-image-upload"
          type="file"
          accept="image/*"
          @change="(event) => handleFileUpload(event)"
        />
      </label>
      <TextImage
        v-if="quizType == 'Text'"
        @update-textimage-src="handleTxtImageSrcUpdate"
      />
      <QuizEdit
        :image-url="imageSrc"
        @update-collect-position="handlePosition"
      />
      <!-- todo: Handle Submit data to database -->
      <input type="submit" value="Save" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { QuizOption, DDquizFormData } from "@/type";
import QuizEdit from "./QuizEdit.vue";
import TextImage from "./TextImage.vue";
import { handleSubmitData } from "../dataAccessLayer.ts";
const quizType = ref("Image");
const imageSrc = ref();

const handleTxtImageSrcUpdate = (src: string) => {
  imageSrc.value = src;
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
form {
  position: relative;
}
input {
  margin-bottom: 2em;
  font-size: large;
  box-shadow: 5px 5px 5px rgb(223, 222, 222) inset;
}
input[type="submit"] {
  position: absolute;
  right: 0;
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
