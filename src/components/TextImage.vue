<template>
  <div class="text-image-container">
    <button @click="generateImage">Generate Image</button>
    <textarea
      v-model="text"
      placeholder="Enter question text body here..."
      rows="5"
      cols="40"
    ></textarea>
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
  const padding = 10;
  if (!context) {
    console.error("Failed to get 2D context from canvas.");
    return;
  }
  context.font = `${fontSize}px Arial`;
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
  console.log(imageSrc.value);
  emit("updateTextimageSrc", imageSrc.value);
};
</script>

<style scoped>
.text-image-container {
  display: flex;
  padding: 2px;
}
textarea {
  width: 80%;
  resize: vertical;
  flex-grow: 1;
}

button {
  color: white;
  width: 80px;
  height: 40px;
  padding: 3px;
  margin: auto;
}

img {
  margin-top: 20px;
  max-width: 100%;
}
</style>
