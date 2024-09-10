<template>
  <div class="edit-container">
    <div class="image-container">
      <img id="output" :src="imageUrl" class="image-style" :class="{ 'cursor-crosshair': isSelecting }"
        @click="handleClick" />
      <!-- Hint for first click -->
      <div v-if="isSelecting" :style="hintStyle" class="hint-style">
        Click to finish the selection
      </div>
      <div v-for="(item, index) in collectPosition" :key="item.id" :style="getItemStyle(item)"
        class="option-item-position" @click="() => collectPosition.splice(index, 1)"></div>
    </div>
    <ul>
      <li v-for="(item, index) in collectPosition" :key="index">
        {{ item.position }}
        <label :for="`option-label-${index}`"> option text: </label>
        <input :id="`option-label-${index}`" type="text" :value="item.label" @input="(event) =>
          updateLabel(index, (event.target as HTMLInputElement).value)
        " />
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref, CSSProperties, computed } from "vue";
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
const hintPosition = ref({ x: 0, y: 0 });
const handleClick = (event: MouseEvent) => {
  const img = event.currentTarget as HTMLImageElement;
  const rect = img.getBoundingClientRect();
  if (!isSelecting.value) {
    // First click: start the selection
    selectionStart.value = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    selectionStart.value = {
      x: selectionStart.value.x / rect.width,
      y: selectionStart.value.y / rect.height,
    };
    isSelecting.value = true;
  } else {
    // Second click: finish the selection
    selectionEnd.value = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    selectionEnd.value = {
      x: selectionEnd.value.x / rect.width,
      y: selectionEnd.value.y / rect.height,
    };
    finalizeSelection();
  }
};

const finalizeSelection = () => {
  if (
    selectionEnd.value.x !== selectionStart.value.x &&
    selectionEnd.value.y !== selectionStart.value.y
  ) {
    // Collect position and size of the selected area
    collectPosition.value.push({
      id: Date.now(),
      position: {
        x: Math.min(selectionStart.value.x, selectionEnd.value.x),
        y: Math.min(selectionStart.value.y, selectionEnd.value.y),
      },
      dimensions: {
        width: Math.abs(selectionEnd.value.x - selectionStart.value.x),
        height: Math.abs(selectionEnd.value.y - selectionStart.value.y),
      },
      label: "*", // Placeholder label
    });
  }

  // Reset selection state
  isSelecting.value = false;
  selectionStart.value = { x: 0, y: 0 };
  selectionEnd.value = { x: 0, y: 0 };

  // Emit updated positions
  emit("update-collect-position", collectPosition.value);
};
const hintStyle = computed<CSSProperties>(() => {
  return {
    position: "absolute",
    top: `${hintPosition.value.y}px`,
    left: `${hintPosition.value.x}px`,
    color: "blue",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: "2px 4px",
    borderRadius: "3px",
    fontSize: "12px",
  };
});
// Function to compute style for each collected item
const getItemStyle = (item: {
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
}): CSSProperties => {
  return {
    position: "absolute",
    top: `${item.position.y * 100}%`,
    left: `${item.position.x * 100}%`,
    width: `${item.dimensions.width * 100}%`,
    height: `${item.dimensions.height * 100}%`,
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
  margin: auto;
  border: solid 1px grey;
  position: relative;
}

.image-style {
  display: block;
  max-width: 100%;
  height: auto;
}

.option-item-position {
  border: 2px dashed blue;
  background: rgba(0, 0, 255);
  position: absolute;
  pointer-events: none;
}

.selected-spot {
  width: 5px;
}

.cursor-crosshair {
  cursor: crosshair;
}

.hint-style {
  position: absolute;
  pointer-events: none;
  user-select: none;
  z-index: 1000;
}
</style>
