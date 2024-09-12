<template>
  <h3>Drag & Drop Quiz Render</h3>
  <div class="container-ddQuiz">
    <!-- Initial D&D Quiz options -->
    <div
      class="drop-zone"
      @drop="onDrop($event, 1)"
      @dragover.prevent
      @dragenter.prevent
    >
      <DragItems
        :item-list="listOne"
        :img-position="imagePosition"
        @start-drag="startDrag"
        @end-drag="endDrag"
      />
    </div>
    <!-- Drop Options in the picture Zone -->

    <div class="dropped-item-area">
      <div class="drop-zone">
        <img ref="imgRef" :src="imageUrl" alt="" @load="getImagePosition" />

        <DragItems
          :item-list="listTwo"
          :img-position="imagePosition"
          @start-drag="startDrag"
          @end-drag="endDrag"
        />
        <div
          v-for="ele in snapItems"
          :key="ele.id"
          :style="itemStyle(ele)"
          class="snap-position"
          @drop="onDrop($event, 2, ele)"
          @dragover.prevent
          @dragenter.prevent
        ></div>
      </div>
    </div>

    <p v-if="showResult">{{ result }}</p>
    <button class="submit-button" @click="handleSubmit">Submit</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, toRefs } from "vue";
import DragItems from "./DragItems.vue";
import { Item } from "../type";
import fallbackImg from "../assets/TestDD.png";
import { sampleDatabase } from "@/dataAccessLayer";
import { getItemStyle, getInitialVal } from "@/utils";

interface OptionsDatabase {
  position: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
  label: string;
}

// here define the reactive props received from main
const props = defineProps<{
  dragQuestion: OptionsDatabase[] | undefined;
  imageSource: string;
}>();
const { dragQuestion, imageSource } = toRefs(props);

const imageUrl = ref<string>(fallbackImg);
const items = ref<Item[]>([]);
const snapItems = ref<Item[]>([]);
const imgRef = ref<HTMLImageElement | null>(null);
const imagePosition = ref<{ imgX: number; imgY: number } | null>(null);
const draggedItem = ref<Item | null>(null);
const initialMousePosition = ref<{ offsetX: number; offsetY: number } | null>(
  null
);
const showResult = ref<boolean>(false);
const result = ref<{ label: string; isCorrect: boolean }[]>([]);

const getImagePosition = () => {
  if (imgRef.value) {
    const rect = imgRef.value.getBoundingClientRect();
    imagePosition.value = {
      imgX: rect.x + window.scrollX,
      imgY: rect.y + window.scrollY,
    };
  }
};
const itemStyle = (ele: Item) => {
  return getItemStyle(ele);
};
// This is the updating of reactive props received from main
watch(
  () => dragQuestion.value,
  (newVal: OptionsDatabase[] | undefined) => {
    const renderData = newVal === undefined ? sampleDatabase : newVal;
    const iniValue = getInitialVal(renderData.length);
    snapItems.value = renderData.map((item, index) => {
      return {
        ...item,
        id: `snap${index}`,
        list: 2,
        dimensions: { width: item.width, height: item.height },
      };
    });
    items.value = renderData.map((item, index) => {
      return {
        ...item,
        id: `${index}`,
        list: 1,
        dimensions: {
          width: iniValue[index].width,
          height: iniValue[index].height,
        },
        position: { x: iniValue[index].x, y: iniValue[index].y },
      };
    });
  },
  { immediate: true }
);
watch(
  () => imageSource.value,
  (newImageSource: string) => {
    imageUrl.value = newImageSource || fallbackImg;
  },
  { immediate: true }
);

const listOne = computed(() =>
  items.value.filter((item: Item) => item.list === 1)
);
const listTwo = computed(() =>
  items.value.filter((item: Item) => item.list === 2)
);

function startDrag({ event, item }: { event: DragEvent; item: Item }) {
  showResult.value = false;
  draggedItem.value = item;
  const rect = (event.target as HTMLElement).getBoundingClientRect();
  initialMousePosition.value = {
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
  };
  event.dataTransfer!.effectAllowed = "move";
  event.dataTransfer!.setData("text/plain", item.id.toString());
}

function endDrag(item: Item) {
  // Reset dragged item
  draggedItem.value = item;
  draggedItem.value = null;
  initialMousePosition.value = null;
}

function onDrop(evt: DragEvent, list: number, snapItem?: Item) {
  evt.preventDefault();
  if (!draggedItem.value) return;
  const itemID = evt.dataTransfer!.getData("text/plain");
  const item = items.value.find((item: Item) => {
    return item.id === itemID;
  });

  if (!item || !initialMousePosition.value) return;

  item.list = list;
  const dropZone = evt.currentTarget as HTMLElement;
  const rect = dropZone.getBoundingClientRect();
  item.position = {
    x: snapItem
      ? snapItem.position.x
      : evt.clientX - rect.left - initialMousePosition.value.offsetX,
    y: snapItem
      ? snapItem.position.y
      : evt.clientY - rect.top - initialMousePosition.value.offsetY,
  };

  item.dimensions = {
    width: item.dimensions.width,
    height: item.dimensions.height,
  };
  if (!snapItem) return;
  snapItem && snapItem.label === item?.label
    ? result.value?.push({ label: snapItem?.label, isCorrect: true })
    : result.value?.push({ label: snapItem?.label, isCorrect: false });
}

function handleSubmit() {
  showResult.value = true;

  return result.value;
}
</script>

<style scoped>
.container-ddQuiz {
  display: flex;
  flex-direction: column;
  margin: auto;
  width: 100%;
  gap: 10px;
}

.drop-zone {
  background-color: #dfdfdf;
  margin: auto;
  min-height: 300px;
  min-width: 300px;
  position: relative;
}

.dropped-item-area {
  display: flex;
  flex-wrap: wrap;

  width: fit-content;
  color: #6c6868;
}

table {
  border-collapse: collapse;
  width: fit-content;
  color: #6c6868;
  padding: 5px;
  border: 2px solid #6c6868;
}

th,
td {
  text-align: left;
  padding: 8px;
  border: 2px solid #6c6868;
}

tr {
  width: 100%;
}

img {
  position: relative;
  max-width: 100%;
  height: auto;
}

.snap-position {
  position: absolute;
  border: 1px dashed rgb(254, 4, 4);
}

.submit-button {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
</style>
