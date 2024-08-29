<template>
  <div>
    <textarea
      v-model="text"
      placeholder="Enter one question text here..."
      rows="5"
      cols="50"
    ></textarea>
    <button @click="generateImage">Generate Image</button>
    <img v-if="imageSrc" :src="imageSrc" alt="Generated Text Image" />
  </div>
</template>

<script setup>
import { ref } from "vue";

const text = ref("");
const imageSrc = ref("");

const generateImage = () => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const fontSize = 20;
  const padding = 20;

  context.font = `${fontSize}px`;
  context.fillStyle = "black";
  context.textAlign = "left";
  context.textBaseline = "top";

  const lines = text.value.split("\n");

  const maxWidth = Math.max(
    ...lines.map((line) => context.measureText(line).width),
  );
  const totalHeight = lines.length * fontSize + padding * 2;

  canvas.width = maxWidth + padding * 2;
  canvas.height = totalHeight;

  context.clearRect(0, 0, canvas.width, canvas.height);
  lines.forEach((line, index) => {
    context.fillText(line, padding, padding + index * fontSize);
  });

  imageSrc.value = canvas.toDataURL("image/png");
};
</script>

<style>
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
