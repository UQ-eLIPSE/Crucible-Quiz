<template>
  <div class="edit-container">
    <div class="image-container">
      <img
        :src="imageUrl"
        id="output"
        class="image-style"
        @mousedown="handlePosition"
      />
      <div
        v-for="(item, index) in collectPosition"
        :style="{ top: item.position.y + 'px', left: item.position.x + 'px' }"
        class="option-item-position"
        :key="item.id"
        @click="() => collectPosition.splice(index, 1)"
      ></div>
    </div>
    <ul>
      <h3>Questions Option Select and Edit</h3>
      <li v-for="(item, index) in collectPosition" :key="index">
        <label :for="`option-label-${index}`"> option text: </label>
        <input
          :id="`option-label-${index}`"
          type="text"
          :value="item.label"
          @input="
            (event) =>
              updateLabel(index, (event.target as HTMLInputElement).value)
          "
        />
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { QuizOption } from "@/type";
defineProps<{
  imageUrl?: string;
}>();

const collectPosition = ref<QuizOption[]>([]);
const emit = defineEmits<{
  (event: "update-collect-position", positions: QuizOption[]): void;
}>();
const handlePosition = (event: MouseEvent) => {
  const img = event.currentTarget as HTMLImageElement;
  const rect = img.getBoundingClientRect();
  // Calculate click position relative to the image
  const x = event.clientX - rect.x;
  const y = event.clientY - rect.y;
  // Collect position with a unique id for each item
  collectPosition.value.push({
    id: Date.now(),
    position: { x, y },
    label: "*", //todo: should be a input change
  });
  emit("update-collect-position", collectPosition.value);
};

const updateLabel = (index: number, newLabel: string) => {
  collectPosition.value[index].label = newLabel;
  emit("update-collect-position", collectPosition.value);
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

.edit-container {
  display: flex;
  flex-wrap: wrap;
}

.image-container {
  position: relative;
  margin: auto;
}

.image-style {
  display: block;
  max-width: 100%;
  height: auto;
}

.option-item-position {
  background-color: #2970b3;
  padding: 5px;
  color: whitesmoke;
  position: absolute;
  cursor: url("src/assets/icons8-delete.svg"), auto;
  width: 5px;
  height: 5px;
  border-radius: 50%;
}

.selected-spot {
  width: 5px;
}
</style>
