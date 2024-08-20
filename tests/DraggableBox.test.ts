import { beforeEach, describe, expect, it, vi } from "vitest";
import { VueWrapper, mount } from "@vue/test-utils";
import DraggableBox from "../src/components/DraggableBox.vue";
import DragItems from "../src/components/DragItems.vue";

describe("DraggableBox.vue", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = mount(DraggableBox, { component: DragItems });
  });
  it("should render drop zones", () => {
    expect(wrapper.find(".drop-zone").exists()).toBeTruthy;
  });

  it("it should increase drag-el in drop zone if drag one box to this drop zone and show the correct name of this box", async () => {
    const dropZone1 = wrapper.findAll(".drop-zone")[0];
    const dropZone2 = wrapper.findAll(".drop-zone")[1];
    const dragEl = wrapper.findAll(".drag-el")[0];

    // Get initial state of dropZone1
    const initialDropZone1Items = dropZone2.findAll(".drag-el");

    // Drag start
    await dragEl.trigger("dragstart", {
      dataTransfer: {
        getData: () => dragEl.attributes("id"),
        setData: () => {},
      },
    });

    // Drop on the second drop zone
    await dropZone2.trigger("drop", {
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

    expect(itemsInDropZone2.length).toBeGreaterThan(
      initialDropZone1Items.length,
    );
    expect(itemsInDropZone2.some((item) => item.text() === dragEl.text())).toBe(
      true,
    );
  });
});
