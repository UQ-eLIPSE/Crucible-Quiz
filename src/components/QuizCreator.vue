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
          @change="(event) => handleFileInput(event)"
        />
      </label>
      <TextImage
        v-if="quizType == 'Text'"
        @update-textimage-src="handleTxtImageSrcUpdate"
      />
      <QuizEdit
        :image-url="imageSrc"
        :collect-position="collectPosition"
        @update-collect-position="handlePosition"
      />
      <input type="submit" value="Save" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, PropType } from "vue";
import { QuizOption, DDquizFormData, QUIZ_QUESTION_DRAG_DROP } from "@/type";
import QuizEdit from "./QuizEdit.vue";
import TextImage from "./TextImage.vue";
import { handleSubmitData } from "../dataAccessLayer.ts";
import { base64ToFile } from "../utils";

const quizType = ref("Image");
const imageSrc = ref<string | undefined>("");
const collectPosition = ref<QuizOption[]>([]);
const formdata = ref<DDquizFormData>({} as DDquizFormData);
const imageFile = ref<File>();

// Accept questions as prop
const props = defineProps({
  questions: {
    type: Object as PropType<QUIZ_QUESTION_DRAG_DROP>,
    required: false,
  },
});

const emit = defineEmits(["save-items"]);

// Watch the questions prop and auto-populate if present
watch(
  () => props.questions,
  (newQuestions) => {
    if (newQuestions) {
      // Populate form with existing questions data
      imageSrc.value = newQuestions.imgUrl;
      collectPosition.value = newQuestions.optionsList;
    }
  },
  { immediate: true }
);

// Handle form actions
const handleTxtImageSrcUpdate = (src: string) => {
  const fileName = "image.jpeg";
  const file = base64ToFile(src, fileName);
  imageFile.value = file;
  imageSrc.value = src;
  collectPosition.value = [];
};

const handleFileInput = (e: Event) => {
  const file = (e.target as HTMLInputElement).files;
  imageSrc.value = file ? URL.createObjectURL(file[0]) : undefined;
  imageFile.value = file ? file[0] : undefined;
  collectPosition.value = [];
};

const handlePosition = (newPositions: QuizOption[]) => {
  collectPosition.value = newPositions;
};

const handleSubmit = () => {
  formdata.value = {
    imageFile: imageFile.value,
    image: imageSrc.value,
    collectPosition: collectPosition.value,
  };
  console.log(formdata.value);
  handleSubmitData(formdata.value); // might have to remove it later on
  emit("save-items", formdata.value);
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
