<template>
  <div class="edit-container">
    <div class="image-container">
      <img
        :src="imageUrl"
        id="output"
        class="image-style"
        @mousedown="startSelection"
        @mousemove="drawSelection"
        @mouseup="endSelection"
      />
      <!-- Render current selection box -->
      <div
        v-if="isSelecting"
        :style="selectionStyle"
        class="option-item-position"
      ></div>
      <div
        v-for="(item, index) in collectPosition"
        :style="getItemStyle(item)"
        class="option-item-position"
        :key="item.id"
        @click="() => collectPosition.splice(index, 1)"
      ></div>
    </div>
    <ul>
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
import { ref, computed, CSSProperties } from "vue";
import { QuizOption } from "@/type";
defineProps<{
  imageUrl?: string;
}>();

const collectPosition = ref<QuizOption[]>([]);
const emit = defineEmits<{
  (event: "update-collect-position", positions: QuizOption[]): void;
}>();
const isSelecting = ref(false);
const selectionStart = ref({ x: 0, y: 0 });
const selectionEnd = ref({ x: 0, y: 0 });

const startSelection = (event: MouseEvent) => {
  const img = event.currentTarget as HTMLImageElement;
  const rect = img.getBoundingClientRect();
  // Calculate the starting position
  selectionStart.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
  isSelecting.value = true;
  console.log("start");
};
const drawSelection = (event: MouseEvent) => {
  if (!isSelecting.value) return;
  const img = event.currentTarget as HTMLImageElement;
  const rect = img.getBoundingClientRect();
  // Update the end position as the mouse moves
  selectionEnd.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
  console.log("draw");
};
const endSelection = () => {
  console.log("end1", !isSelecting.value);
  if (!isSelecting.value) return;
  // Collect position and size of the selected area
  collectPosition.value.push({
    id: Date.now(),
    position: {
      x: Math.min(selectionStart.value.x, selectionEnd.value.x),
      y: Math.min(selectionStart.value.y, selectionEnd.value.y),
      width: Math.abs(selectionEnd.value.x - selectionStart.value.x),
      height: Math.abs(selectionEnd.value.y - selectionStart.value.y),
    },
    label: "*", // To be changed based on input
  });
  emit("update-collect-position", collectPosition.value);
  // Reset selection state
  isSelecting.value = false;
  selectionStart.value = { x: 0, y: 0 };
  selectionEnd.value = { x: 0, y: 0 };
  console.log("end");
  console.log(collectPosition.value);
};

// Computed style for the selection box
const selectionStyle = computed<CSSProperties>(() => {
  if (!isSelecting.value) return {};
  const x = Math.min(selectionStart.value.x, selectionEnd.value.x);
  const y = Math.min(selectionStart.value.y, selectionEnd.value.y);
  const width = Math.abs(selectionEnd.value.x - selectionStart.value.x);
  const height = Math.abs(selectionEnd.value.y - selectionStart.value.y);

  return {
    position: "absolute",
    top: `${y}px`,
    left: `${x}px`,
    width: `${width}px`,
    height: `${height}px`,
    border: "2px dashed blue",
    pointerEvents: "none",
  };
});

// Function to compute style for each collected item
const getItemStyle = (item: {
  position: { x: number; y: number; width: number; height: number };
}): CSSProperties => {
  return {
    position: "absolute",
    top: `${item.position.y}px`,
    left: `${item.position.x}px`,
    width: `${item.position.width}px`,
    height: `${item.position.height}px`,
    border: "2px solid red",
    pointerEvents: "auto",
  };
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
  flex-direction: column;
  min-height: 200px;
}

.image-container {
  position: relative;
  margin: auto;
  border: solid 1px grey;
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

  /* border: 2px dashed blue;
  background: rgba(0, 0, 255, 0.2);
  position: absolute;
  pointer-events: none; */
}

.selected-spot {
  width: 5px;
}
</style>
