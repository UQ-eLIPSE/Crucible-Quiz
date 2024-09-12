<template>
  <div
    v-for="item in itemList"
    :key="item.id"
    class="drag-el"
    :style="itemStyle(item)"
    draggable="true"
    @dragstart="(event) => emit('start-drag', { event, item })"
    @dragend="(__event) => emit('end-drag', item)"
  >
    {{ item.label }}
  </div>
</template>
<script setup lang="ts">
import { Item } from "@/type";
import { getItemStyle } from "@/utils";

const emit = defineEmits<{
  (event: "start-drag", data: { event: DragEvent; item: Item }): void;
  (event: "end-drag", data: Item): void;
}>();

defineProps<{
  itemList?: Item[];
  imgPosition: { imgX: number; imgY: number } | null;
}>();

const itemStyle = (ele: Item) => {
  return getItemStyle(ele);
};
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
