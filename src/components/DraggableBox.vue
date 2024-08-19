<template>
    <div>
        <div class="drop-zone" @drop="onDrop($event, 1)" @dragover.prevent @dragenter.prevent>
            <div v-for="item in listOne" :key="item.id" class="drag-el"
                :style="{ top: item.position.y + 'px', left: item.position.x + 'px' }" draggable="true"
                @dragstart="startDrag($event, item)" @dragend="endDrag(item)">
                {{ item.title }}
            </div>
        </div>

        <div class="drop-zone" @drop="onDrop($event, 2)" @dragover.prevent @dragenter.prevent>
            <div v-for="item in listTwo" :key="item.id" class="drag-el"
                :style="{ top: item.position.y + 'px', left: item.position.x + 'px' }" draggable="true"
                @dragstart="startDrag($event, item)" @dragend="endDrag(item)">
                {{ item.title }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Define the reactive state
interface Item {
    id: number;
    title: string;
    list: number;
    position: { x: number; y: number };
}

const items = ref<Item[]>([
    { id: 0, title: 'Item A', list: 1, position: { x: 0, y: 0 } },
    { id: 1, title: 'Item B', list: 1, position: { x: 100, y: 0 } },
    { id: 2, title: 'Item C', list: 1, position: { x: 200, y: 0 } },
]);

const listOne = computed(() => items.value.filter(item => item.list === 1));
const listTwo = computed(() => items.value.filter(item => item.list === 2));

// Store the item being dragged
let draggedItem: Item | null = null;

function startDrag(evt: DragEvent, item: Item) {
    draggedItem = item;
    evt.dataTransfer!.effectAllowed = 'move';
    evt.dataTransfer!.setData('text/plain', item.id.toString());
}

function endDrag(item: Item) {
    // Reset dragged item
    draggedItem = item
    draggedItem = null;
}

function onDrop(evt: DragEvent, list: number) {
    evt.preventDefault();
    if (draggedItem) {
        const itemID = evt.dataTransfer!.getData('text/plain');
        const item = items.value.find(item => item.id === Number(itemID));
        if (item) {
            item.list = list;
            // Update position
            const dropZone = evt.currentTarget as HTMLElement;
            const rect = dropZone.getBoundingClientRect();
            item.position = {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }
    }
}
</script>

<style scoped>
.drop-zone {
    background-color: #eee;
    margin-bottom: 10px;
    padding: 10px;
    height: 500px;
    width: 500px;
    position: relative;

}

.drag-el {
    background-color: #6c6868;
    padding: 5px;
    color: red;
    position: absolute;
    cursor: grab;
}
</style>