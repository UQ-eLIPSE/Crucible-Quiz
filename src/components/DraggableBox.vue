<template>
    <div>
        <!-- Initial D&D Quiz options -->
        <div class="drop-zone" @drop="onDrop($event, 1)" @dragover.prevent @dragenter.prevent>
            <DragItems :item-list="listOne" @start-drag="startDrag" @end-drag="endDrag" />
        </div>
        <!-- Drop Options in the picture Zone -->
        <div class="dropped-item-area">
            <div class="drop-zone" @drop="onDrop($event, 2)" @dragover.prevent @dragenter.prevent>
                <DragItems :item-list="listTwo" @start-drag="startDrag" @end-drag="endDrag" />
            </div>
            <!-- Collection Result and todo: add submit data form -->
            <div>Item Position In Drop Zone 2
                <table>
                    <tr>
                        <th>Item Id</th>
                        <th>Item Title</th>
                        <th>Item Position</th>
                    </tr>
                    <tr v-for="item in listTwo" :key="item.id">
                        <td>{{ item.id }}</td>
                        <td>{{ item.title }}</td>
                        <td>{{ item.position }}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DragItems from "./DragItems.vue";
import { Item } from '../type';

// Todo: these Data should come from quiz database as options
const items = ref<Item[]>([
    { id: 0, title: 'Item A', list: 1, position: { x: 0, y: 0 } },
    { id: 1, title: 'Item B', list: 1, position: { x: 100, y: 0 } },
    { id: 2, title: 'Item C', list: 1, position: { x: 200, y: 0 } },
]);

const listOne = computed(() => items.value.filter(item => item.list === 1));
const listTwo = computed(() => items.value.filter(item => item.list === 2));

const draggedItem = ref<Item | null>(null);

function startDrag({ event, item }: { event: DragEvent; item: Item }) {
    draggedItem.value = item;

    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('text/plain', item.id.toString());
}

function endDrag(item: Item) {
    // Reset dragged item
    draggedItem.value = item
    draggedItem.value = null;
}

function onDrop(evt: DragEvent, list: number) {
    evt.preventDefault();
    if (draggedItem.value) {
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
    color: whitesmoke;
    position: absolute;
    cursor: grab;
}

.dropped-item-area {
    display: flex;
    border: 2px solid purple;
    min-width: 1000px;
    color: #6c6868
}

table {
    border-collapse: collapse;
    width: 400px;
    color: #6c6868;
    margin: 5px;
    border: 2px solid #6c6868;
}

th,
td {
    text-align: left;
    padding: 8px;
    border: 2px solid #6c6868
}

tr {
    width: 100%;
}
</style>