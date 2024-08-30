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
      <div
        class="drop-zone"
        @drop="onDrop($event, 2)"
        @dragover.prevent
        @dragenter.prevent
      >
        <img ref="imgRef" :src="imageUrl" alt="" @load="getImagePosition" />

        <DragItems
          :item-list="listTwo"
          :img-position="imagePosition"
          @start-drag="startDrag"
          @end-drag="endDrag"
        />
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import DragItems from "./DragItems.vue";
import { DDquizFormData, Item } from "../type";
import fallbackImg from "../assets/TestDD.png";
const imageUrl = ref<string>(fallbackImg);
// Todo: these Data should come from quiz database as options

const items = ref<Item[]>([
  { id: 0, label: "Item A", position: { x: 0, y: 0 }, list: 1 },
  { id: 1, label: "Item B", position: { x: 100, y: 0 }, list: 1 },
  { id: 2, label: "Item C", position: { x: 200, y: 0 }, list: 1 },
]);
const imgRef = ref<HTMLImageElement | null>();
const imagePosition = ref<{ imgX: number; imgY: number } | null>(null);
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
  if (localStorage.getItem("ddQuizFormdata")) {
    const storedData = localStorage.getItem("ddQuizFormdata");
    if (storedData) {
      const storeDDquizData: DDquizFormData = JSON.parse(
        localStorage.getItem("ddQuizFormdata") ?? "",
      );
      const collectPositionFrLocal = storeDDquizData["collectPosition"];
      items.value = collectPositionFrLocal.map((item, index) => {
        return { ...item, list: 1, position: { x: 50, y: index * 40 + 100 } };
      }); //Todo: to fix a suitable position in Render Quiz Ticket

      imageUrl.value = storeDDquizData.image;
    }
  }
});

const listOne = computed(() => items.value.filter((item) => item.list === 1));
const listTwo = computed(() => items.value.filter((item) => item.list === 2));

const draggedItem = ref<Item | null>(null);

function startDrag({ event, item }: { event: DragEvent; item: Item }) {
  draggedItem.value = item;

  event.dataTransfer!.effectAllowed = "move";
  event.dataTransfer!.setData("text/plain", item.id.toString());
}

function endDrag(item: Item) {
  // Reset dragged item
  draggedItem.value = item;
  draggedItem.value = null;
}

function onDrop(evt: DragEvent, list: number) {
  evt.preventDefault();
  if (draggedItem.value) {
    const itemID = evt.dataTransfer!.getData("text/plain");
    const item = items.value.find((item) => item.id === Number(itemID));
    if (item) {
      item.list = list;
      // Update position
      const dropZone = evt.currentTarget as HTMLElement;
      const rect = dropZone.getBoundingClientRect();
      item.position = {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
      };
    }
  }
}
</script>

<style scoped>
.container-ddQuiz {
  display: flex;
  margin: auto;
  width: 100%;
  gap: 10px;
}

.drop-zone {
  background-color: #dfdfdf;
  margin-bottom: 10px;
  padding: 10px;
  min-height: 300px;
  min-width: 300px;
  position: relative;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
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
</style>
