<template>
  <h3>Drag & Drop Quiz Render</h3>
  <div class="container-ddQuiz">
    <!-- Initial D&D Quiz options -->
    <div class="drop-zone" @drop="onDrop($event, 1)" @dragover.prevent @dragenter.prevent>
      <DragItems :item-list="listOne" :img-position="imagePosition" @start-drag="startDrag" @end-drag="endDrag" />
    </div>
    <!-- Drop Options in the picture Zone -->

    <div class="dropped-item-area">
      <div class="drop-zone">
        <img ref="imgRef" :src="imageUrl" alt="" @load="getImagePosition" />

        <DragItems :item-list="listTwo" :img-position="imagePosition" @start-drag="startDrag" @end-drag="endDrag" />
        <div v-for="ele in snapItems" :key="ele.id" :style="{
      top: ele.position.y + 'px',
      left: ele.position.x + 'px',
      width: ele.dimensions.width + 'px',
      height: ele.dimensions.height + 'px',
    }" class="snap-position" @drop="onDrop($event, 2, ele)" @dragover.prevent @dragenter.prevent></div>
      </div>
      <!-- Collection Result and todo: add submit data form -->
      <div>
        Item Position In Drop Zone 2
        <table>
          <tr>
            <th>Item Id</th>
            <th>Item Title</th>
            <th>Item Position</th>
          </tr>
          <tr v-for="item in listTwo" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.label }}</td>
            <td>{{ item.position }}</td>
          </tr>
        </table>
      </div>
    </div>
    <div v-if="showResult">
      <p v-if="result" class="success-message">Submission successful!</p>
      <p v-else class="error-message">Submission failed!</p>
    </div>
    <button class="submit-button" @click="handleSubmit">Submit</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, toRefs } from "vue";
import DragItems from "./DragItems.vue";
import { Item } from "../type";
import { sampleDatabase } from "@/dataAccessLayer";
import fallbackImg from "../assets/TestDD.png";

interface OptionsDatabase {
  imgUrl: string;
  position: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
  label: string;
}

const props = defineProps<{
  dragQuestion: OptionsDatabase[] | undefined;
}>();

const { dragQuestion } = toRefs(props);

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
const result = ref<boolean>(false);

const getImagePosition = () => {
  if (imgRef.value) {
    const rect = imgRef.value.getBoundingClientRect();
    imagePosition.value = {
      imgX: rect.x + window.scrollX,
      imgY: rect.y + window.scrollY,
    };
  }
};

onMounted(() => {
  console.log("onMounted: ", dragQuestion.value)
  if (dragQuestion.value === undefined) {
    console.log("no data from db")
    imageUrl.value = sampleDatabase[0].imgUrl;
    snapItems.value = sampleDatabase.map((item, index) => {
      return {
        ...item,
        id: index + 200,
        list: 2,
        dimensions: { width: item.width, height: item.height },
      };
    });
    items.value = sampleDatabase.map((item, index) => {
      return {
        ...item,
        id: index + 100,
        list: 1,
        dimensions: { width: 25, height: 25 },
        position: { x: 50, y: index * 40 + 100 },
      };
    });
  } else {
    console.log("onmoutn");
    imageUrl.value = dragQuestion.value[0].imgUrl;
    snapItems.value = dragQuestion.value.map((item, index) => {
      return {
        ...item,
        id: index + 200,
        list: 2,
        dimensions: { width: item.width, height: item.height },
      };
    });
    items.value = dragQuestion.value.map((item, index) => {
      return {
        ...item,
        id: index + 100,
        list: 1,
        dimensions: { width: 25, height: 25 },
        position: { x: 50, y: index * 40 + 100 },
      };
    });
  }
});

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
  if (draggedItem.value) {
    const itemID = evt.dataTransfer!.getData("text/plain");
    const item = items.value.find((item: Item) => item.id === Number(itemID));
    if (item && initialMousePosition.value) {
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
    }
  }
}

function handleSubmit() {
  showResult.value = true;

  if (listOne.value.length > 0) {
    result.value = false;
    return;
  }

  result.value = listTwo.value.every((item) => {
    const matchingSnapItem = snapItems.value.find(
      (snapItem) => snapItem.id === item.id
    );
    return (
      matchingSnapItem &&
      item.position.x === matchingSnapItem.position.x &&
      item.position.y === matchingSnapItem.position.y
    );
  });
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
