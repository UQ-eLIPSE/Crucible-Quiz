<template>
  <div
    v-for="item in itemList"
    :key="item.id"
    class="drag-el"
    draggable="true"
    :style="getItemStyle(item, true)"
    @dragstart="(event) => emit('start-drag', { event, item })"
    @dragend="(__event) => emit('end-drag', item)"
  >
    {{ item.label }}
  </div>
</template>
<script setup lang="ts">
import { Item } from "@/type";
import { CSSProperties } from "vue";

const emit = defineEmits<{
  (event: "start-drag", data: { event: DragEvent; item: Item }): void;
  (event: "end-drag", data: Item): void;
}>();

defineProps<{
  itemList?: Item[];
  imgPosition: { imgX: number; imgY: number } | null;
  getItemStyle: (item: Item, draggable: boolean) => CSSProperties;
}>();
</script>
<style>
.drag-el {
  background-color: #6c6868;
  padding: 0px;
  color: whitesmoke;
  position: absolute;
  cursor: grab;
  z-index: 100;
}
</style>
