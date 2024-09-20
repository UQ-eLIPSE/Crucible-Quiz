<template>
  <div class="container-ddQuiz">
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
          :style="[itemStyle(ele)]"
          class="snap-position"
          @drop="onDrop($event, 2, ele)"
          @dragover.prevent
          @dragenter.prevent
        >
          {{ ele.label }}
        </div>
      </div>
    </div>

    <!-- Now the drop-zone below the image -->
    <div
      class="drop-zone adjustable-drop-zone"
      :style="{ width: imageWidth + 'px', height: height + 'px' }"
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
  </div>
  <p
    v-if="showResult"
    :class="{
      'text-correct': result,
      'text-incorrect': !result,
    }"
  >
    {{ score }}
  </p>
  <button class="submit-button" @click="handleSubmit">Submit</button>
</template>

<script setup lang="ts">
import { ref, computed, watch, toRefs } from "vue";
import DragItems from "./DragItems.vue";
import { Item, OptionsDatabase } from "../type";
import fallbackImg from "../assets/TestDD.png";
import { sampleDatabase } from "@/dataAccessLayer";
import { getItemStyle, getInitialVal, shuffleArray } from "@/utils";

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
const options = ref<OptionsDatabase[]>([]);
const emit = defineEmits(["submit-answer"]);
const showResult = ref<boolean>(false);
const result = ref<boolean>(false);
const score = ref<string>("");
const imageWidth = ref<number>(300);
const height = ref<number>(30);

const getImagePosition = () => {
  if (imgRef.value) {
    const rect = imgRef.value.getBoundingClientRect();
    imagePosition.value = {
      imgX: rect.x + window.scrollX,
      imgY: rect.y + window.scrollY,
    };
    imageWidth.value = rect.width;
    const shuffledOptions = shuffleArray([...options.value]);
    const { positions, totalHeight } = getInitialVal(
      shuffledOptions,
      imageWidth.value
    );
    height.value = totalHeight;
    items.value = shuffledOptions.map((item, index) => {
      return {
        ...item,
        id: `${item.id}`,
        list: 1,
        width: item.width,
        height: item.height,
        position: { x: positions[index].x, y: positions[index].y },
      };
    });
  }
};
const itemStyle = (ele: Item) => {
  return getItemStyle(ele);
};

watch(
  () => dragQuestion.value,
  (newVal: OptionsDatabase[] | undefined) => {
    options.value = newVal === undefined ? sampleDatabase : newVal;
    console.log(options.value);
    snapItems.value = options.value.map((item, index) => {
      return {
        ...item,
        id: `snap${item.id}`,
        label: String.fromCharCode(65 + index),
        list: 2,
        width: item.width,
        height: item.height,
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
}

function handleSubmit() {
  showResult.value = true;

  const totalItems = snapItems.value.length;
  let correctItems = 0;

  listTwo.value.forEach((item) => {
    const matchingSnapItem = snapItems.value.find(
      (snapItem) => snapItem.id === `snap${item.id}`
    );
    if (
      matchingSnapItem &&
      item.position.x === matchingSnapItem.position.x &&
      item.position.y === matchingSnapItem.position.y
    ) {
      correctItems += 1;
    }
  });

  if (correctItems === totalItems) {
    score.value = "Well Done!";
  } else {
    score.value = "Try Again!";
  }

  result.value = correctItems === totalItems;
  emit("submit-answer", result.value);
}
</script>

<style scoped>
.container-ddQuiz {
  display: flex;
  flex-direction: column;
  margin: auto;
  width: 100%;
  gap: 10px;
  background-color: white;
}

.drop-zone {
  background-color: #dfdfdf;
  margin: auto;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.adjustable-drop-zone {
  margin-top: 10px;
  min-width: fit-content;
  background-color: #dfdfdf;
  border: 1px solid #ccc;
}

.drop-zone img {
  position: relative;
  max-width: 100%;
  height: auto;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.dropped-item-area {
  display: flex;
  flex-wrap: wrap;
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

.snap-position {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit-button {
  background-color: #49075e;
  margin-top: 5px;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.text-correct,
.text-incorrect {
  background-color: lightgreen;
  padding: 10px;
  border-radius: 5px;
  width: 50%;
  text-align: center;
  margin: 0 auto;
  margin-top: 5px;
}

.text-incorrect {
  background-color: lightcoral;
}
</style>
