import { beforeEach, describe, expect, it } from "vitest";
import { VueWrapper, mount } from "@vue/test-utils";
import DraggableBox from "../src/components/DraggableBox.vue";

describe("DraggableBox.vue", () => {
  let wrapper: VueWrapper;

  beforeEach(async () => {
    wrapper = mount(DraggableBox);

    wrapper.vm.items = [
      {
        id: "3",
        label: "Item A",
        dimensions: { width: 1, height: 1 },
        position: { x: 0, y: 0 },
        list: 1,
      },
      {
        id: "1",
        label: "Item B",
        dimensions: { width: 1, height: 1 },
        position: { x: 100, y: 0 },
        list: 1,
      },
      {
        id: "2",
        label: "Item C",
        dimensions: { width: 1, height: 1 },
        position: { x: 200, y: 0 },
        list: 1,
      },
    ];

    wrapper.vm.snapItems = [
      {
        id: "snap3",
        label: "Item A",
        dimensions: { width: 1, height: 1 },
        position: { x: 0, y: 0 },
        list: 2,
      },
      {
        id: "snap1",
        label: "Item B",
        dimensions: { width: 1, height: 1 },
        position: { x: 100, y: 0 },
        list: 2,
      },
      {
        id: "snap2",
        label: "Item C",
        dimensions: { width: 1, height: 1 },
        position: { x: 200, y: 0 },
        list: 2,
      },
    ];

    await wrapper.vm.$nextTick();
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
    let dataTransferMock = {
      data: {},
      setData: function (key, value) {
        this.data[key] = value;
      },
      getData: function (key) {
        return this.data[key];
      },
    };

    // Drag start
    await dragEl.trigger("dragstart", {
      dataTransfer: dataTransferMock,
    });

    dataTransferMock.setData("id", dragEl.attributes("id"));

    // Drop on the second drop zone
    await dropsnap.trigger("drop", {
      dataTransfer: dataTransferMock,
    });

    await dropZone2.trigger("dragover", {
      dataTransfer: { dropEffect: "move" },
    });

    await wrapper.vm.$nextTick();

    const itemsInDropZone2 = dropZone2.findAll(".drag-el");
    const itemsInDropZone1 = dropZone1.findAll(".drag-el");

    expect(itemsInDropZone2.length).toBeGreaterThan(
      initialDropZone2Items.length
    );
    expect(itemsInDropZone1.length).toBeLessThan(initialDropZone1Items.length);
    expect(itemsInDropZone2.some((item) => item.text() === dragEl.text())).toBe(
      true
    );
  });
});
