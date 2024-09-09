<template>
  <div class="text-image-container">
    <textarea
      v-model="text"
      placeholder="Enter question text body here..."
      rows="5"
      cols="50"
    ></textarea>
    <button @click.prevent="generateImage">Convert</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["updateTextimageSrc"]);

const text = ref("");
const imageSrc = ref("");

const generateImage = () => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const fontSize = 20;
  const padding = 5;
  if (!context) {
    console.error("Failed to get 2D context from canvas.");
    return;
  }

  const lines = text.value.split("\n");

  const maxWidth = Math.max(
    ...lines.map((line) => context.measureText(line).width)
  );
  const totalHeight = lines.length * fontSize + padding * 2;

  canvas.width = Math.max(maxWidth, 800);
  canvas.height = Math.max(totalHeight, 200);

  context.font = `${fontSize}px verdana`;
  context.fillStyle = "black";
  context.textAlign = "left";
  context.textBaseline = "top";

  context.clearRect(0, 0, canvas.width, canvas.height);
  lines.forEach((line, index) => {
    context.fillText(line, padding, padding + index * fontSize);
  });

  imageSrc.value = canvas.toDataURL("image/png");
  emit("updateTextimageSrc", imageSrc.value);
};
</script>

<style scoped>
.text-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2px;
}
textarea {
  width: 80%;
  resize: vertical;
  font-size: large;
}

button {
  color: black;
  width: 80px;
  height: 40px;
  padding: 3px;
  margin: auto;
  background-color: transparent !important;
  border: 2px solid rgb(74, 109, 206);
}

img {
  margin-top: 20px;
  max-width: 100%;
}
</style>
