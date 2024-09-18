<template>
  <div class="edit-container">
    <div class="image-container">
      <div
        :style="selectionStyle"
        class="selection-rectangle"
        v-show="isSelecting"
      ></div>

      <img
        :src="localImageUrl"
        id="output"
        class="image-style"
        @click="handleClick"
        @mousemove="handleMouseMove"
        :class="{ 'cursor-crosshair': isSelecting }"
      />
      <!-- Hint for first click -->
      <div v-if="isSelecting" :style="hintStyle" class="hint-style">
        Click to finish the selection
      </div>
      <div
        v-for="(item, index) in localCollectPosition"
        :style="getItemStyle(item)"
        class="option-item-position"
        :key="item.id"
        @click="() => removePosition(index)"
      ></div>
    </div>
    <ul>
      <li v-for="(item, index) in localCollectPosition" :key="index">
        {{ item.position }}
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
import { ref, watch, CSSProperties, computed, StyleValue } from "vue";
import { QuizOption } from "@/type";

// Props
const props = defineProps<{
  imageUrl?: string;
  collectPosition?: QuizOption[];
}>();

// Emit
const emit = defineEmits<{
  (event: "update-collect-position", positions: QuizOption[]): void;
}>();

// Local reactive state
const localImageUrl = ref<string>(props.imageUrl || ""); // Local image URL
const localCollectPosition = ref<QuizOption[]>(
  props.collectPosition || ([] as QuizOption[])
);
const isSelecting = ref(false);
const selectionStart = ref({ x: 0, y: 0 });
const selectionEnd = ref({ x: 0, y: 0 });
const hintPosition = ref({ x: 0, y: 0 });
const currCursorPos = ref({ x: 0, y: 0 });
const selectionStyle = computed(() => {
  const getDimension = (a: number, b: number, isMin: boolean = false) => {
    return `${isMin ? Math.min(a, b) : Math.abs(a - b)}px`;
  };
  return {
    border: "4px dashed rgb(254, 4, 4)",
    pointerEvents: "none",
    position: "absolute",
    left: getDimension(currCursorPos.value.x, selectionStart.value.x, true),
    top: getDimension(currCursorPos.value.y, selectionStart.value.y, true),
    width: getDimension(currCursorPos.value.x, selectionStart.value.x),
    height: getDimension(currCursorPos.value.y, selectionStart.value.y),
  } as StyleValue;
});

const handleMouseMove = (event: MouseEvent) => {
  const { left, top } = (
    event.target as HTMLDivElement
  ).getBoundingClientRect();

  currCursorPos.value = {
    x: event.clientX - left,
    y: event.clientY - top,
  };
};

// Watch the collectPosition prop and sync it with local state
watch(
  () => props.collectPosition,
  (newPositions) => {
    localCollectPosition.value = newPositions || [];
  },
  { immediate: true }
);

// Watch imageUrl prop and update localImageUrl when it changes
watch(
  () => props.imageUrl,
  (newImageUrl) => {
    console.log(newImageUrl);
    localImageUrl.value = newImageUrl || "";
  },
  { immediate: true }
);

// Handle click to create new selection
const handleClick = (event: MouseEvent) => {
  const img = event.currentTarget as HTMLImageElement;
  const rect = img.getBoundingClientRect();
  if (!isSelecting.value) {
    selectionStart.value = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    isSelecting.value = true;
  } else {
    selectionEnd.value = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    finalizeSelection();
  }
};

// Finalize the selection
const finalizeSelection = () => {
  if (
    selectionEnd.value.x !== selectionStart.value.x &&
    selectionEnd.value.y !== selectionStart.value.y
  ) {
    localCollectPosition.value.push({
      id: Date.now().toString(),
      position: {
        x: Math.min(selectionStart.value.x, selectionEnd.value.x),
        y: Math.min(selectionStart.value.y, selectionEnd.value.y),
      },
      width: Math.abs(selectionEnd.value.x - selectionStart.value.x),
      height: Math.abs(selectionEnd.value.y - selectionStart.value.y),
      label: "*", // Placeholder label
    });
  }

  // Reset selection state
  isSelecting.value = false;
  selectionStart.value = { x: 0, y: 0 };
  selectionEnd.value = { x: 0, y: 0 };

  // Emit updated positions
  emit("update-collect-position", localCollectPosition.value);
};

// Handle removing a position
const removePosition = (index: number) => {
  localCollectPosition.value.splice(index, 1);
  emit("update-collect-position", localCollectPosition.value);
};

// Function to compute the style for each item
const getItemStyle = (item: {
  position: { x: number; y: number };
  width: number;
  height: number;
}): CSSProperties => {
  return {
    position: "absolute",
    top: `${item.position.y}px`,
    left: `${item.position.x}px`,
    width: `${item.width}px`,
    height: `${item.height}px`,
    pointerEvents: "auto",
  };
};

// Update label
const updateLabel = (index: number, newLabel: string) => {
  localCollectPosition.value[index].label = newLabel;
  emit("update-collect-position", localCollectPosition.value);
};

// Hint style
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
