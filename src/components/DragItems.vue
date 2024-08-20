<template>

    <div v-for="item in itemList" :key="item.id" class="drag-el"
        :style="{ top: item.position.y + 'px', left: item.position.x + 'px' }" draggable="true"
        @dragstart="(event) => emit('start-drag', { event, item })" @dragend="(__event) => emit('end-drag', item)">
        {{ item.title }}
    </div>
</template>
<script setup lang="ts">
import { Item } from '@/type';

const emit = defineEmits<{
    (event: 'start-drag', data: { event: DragEvent; item: Item }): void;
    (event: 'end-drag', data: Item): void;
}>();

defineProps<{
    itemList?: Item[]
}>()

</script>
<style>
.drag-el {
    background-color: #6c6868;
    padding: 5px;
    color: whitesmoke;
    position: absolute;
    cursor: grab;
}
</style>