<template>
    <form action="">
        <input type="file" accept="image/*" @change="(event) => handleFileUpload(event)" />
        upload your image here
    </form>
    <div>

        <div class="image-container">
            <img :src="imageSrc ?? ''" id="output" class="image-style" @mousedown="handlePosition" />
            <div v-for="(item, index) in  collectPosition " :style="{ top: item.y + 'px', left: item.x + 'px' }"
                class="option-item-position" :key="item.id" @click="() => collectPosition.splice(index, 1)">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const form = ref({ media: {} });
const collectPosition = ref<{ id: number; x: number; y: number }[]>([])
const imageSrc = ref();

const handleFileUpload = (e: Event) => {
    const file = (e.target as HTMLInputElement).files
    imageSrc.value = file ? URL.createObjectURL(file[0]) : ""
}

const handlePosition = (event: MouseEvent) => {
    const img = event.currentTarget as HTMLImageElement;
    const rect = img.getBoundingClientRect();
    console.log("img size: ", rect)
    // Calculate click position relative to the image
    const x = event.clientX - rect.x
    const y = event.clientY - rect.y
    console.log("x", x)
    // Collect position with a unique id for each item
    collectPosition.value.push({
        id: Date.now(),
        x: x,
        y: y
    });
}

</script>

<style>
.image-container {
    position: relative;
}

.image-style {
    display: block;
    max-width: 100%;
    height: auto;
}

.option-item-position {
    background-color: #2970b3;
    padding: 5px;
    color: whitesmoke;
    position: absolute;
    cursor: url('src/assets/icons8-delete.svg'), auto;
    width: 5px;
    height: 5px;
    border-radius: 50%;
}

.selected-spot {
    width: 5px;

}
</style>