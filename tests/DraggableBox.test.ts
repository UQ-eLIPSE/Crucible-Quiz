import { beforeEach, describe, expect, it, vi } from "vitest";
import { VueWrapper, mount } from "@vue/test-utils";
import DraggableBox from "../src/components/DraggableBox.vue";

describe("DraggableBox.vue", () => {
  let wrapper: VueWrapper;
  global.ResizeObserver = class ResizeObserver {
    constructor() {
      this.observe = vi.fn();
      this.unobserve = vi.fn();
      this.disconnect = vi.fn();
    }

    observe() {}
    unobserve() {}
    disconnect() {}
  };
  beforeEach(async () => {
    wrapper = mount(DraggableBox);

    wrapper.vm.items = [
      { id: 0, label: "Item A", dimensions: { width: 1, height: 1 }, position: { x: 0, y: 0 }, list: 1 },
      { id: 1, label: "Item B", dimensions: { width: 1, height: 1 }, position: { x: 100, y: 0 }, list: 1 },
      { id: 2, label: "Item C", dimensions: { width: 1, height: 1 }, position: { x: 200, y: 0 }, list: 1 },
    ];

    wrapper.vm.snapItems = [
      { id: 0, label: "Item A", dimensions: { width: 1, height: 1 }, position: { x: 0, y: 0 }, list: 2 },
      { id: 1, label: "Item B", dimensions: { width: 1, height: 1 }, position: { x: 100, y: 0 }, list: 2 },
      { id: 2, label: "Item C", dimensions: { width: 1, height: 1 }, position: { x: 200, y: 0 }, list: 2 },
    ];

    await wrapper.vm.$nextTick(); 
  });

  it("should render drop zones", () => {
    expect(wrapper.find(".drop-zone").exists()).toBeTruthy();
  });

  it("it should increase drag-el in drop zone if drag one box to this drop zone and show the correct name of this box", async () => {
    const dropZone1 = wrapper.findAll(".drop-zone")[0];
    const dropZone2 = wrapper.findAll(".drop-zone")[1];
    const dropsnap = wrapper.findAll(".snap-position")[0];
    const dragEl = wrapper.findAll(".drag-el")[0];

    // Get initial state of dropZone1
    const initialDropZone2Items = dropZone2.findAll(".drag-el");
    const initialDropZone1Items = dropZone1.findAll(".drag-el");

    // Drag start
    await dragEl.trigger("dragstart", {
      dataTransfer: {
        getData: () => dragEl.attributes("id"),
        setData: () => {},
      },
    });

    // Drop on the second drop zone
    await dropsnap.trigger("drop", {
      dataTransfer: {
        getData: () => dragEl.element.id,
      },
    });

    await dropZone2.trigger("dragover", {
      dataTransfer: {
        dropEffect: "move",
      },
    });

    await wrapper.vm.$nextTick();

    const itemsInDropZone2 = dropZone2.findAll(".drag-el");
    const itemsInDropZone1 = dropZone1.findAll(".drag-el");

    expect(itemsInDropZone2.length).toBeGreaterThan(initialDropZone2Items.length);
    expect(itemsInDropZone1.length).toBeLessThan(initialDropZone1Items.length);
    expect(itemsInDropZone2.some((item) => item.text() === dragEl.text())).toBe(true);
  });
});
