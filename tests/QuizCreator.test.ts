import { describe, it, expect, beforeEach } from "vitest";
import { VueWrapper, mount } from "@vue/test-utils";
import QuizEdit from "../src/components/QuizEdit.vue";
import { nextTick } from "vue";
import testImageUrl from "../src/assets/TestDD.png";

describe("QuizEdit", () => {
  let wrapper: VueWrapper;

  beforeEach(async () => {
    wrapper = mount(QuizEdit, {
      context: { props: { imageUrl: testImageUrl } },
    });
    await nextTick();
  });

  it("should found image", async () => {
    expect(wrapper.find("img").exists()).toBe(true);
  });

  it("should add position marker on two image clicks", async () => {
    const img = wrapper.find(".image-style");

    // First click to start the selection
    await img.trigger("click", { clientX: 300, clientY: 300 });

    // Ensure the selection start was registered
    await nextTick();
    expect(wrapper.vm.isSelecting).toBe(true);

    // Second click to end the selection
    await img.trigger("click", { clientX: 310, clientY: 320 });

    // Ensure the selection was finalized
    await nextTick();
    const positions = wrapper.findAll(".option-item-position");
    expect(positions.length).toBe(1);

    const style = window.getComputedStyle(positions[0].element as HTMLElement);
    expect(style.top).toBe("300px");
    expect(style.left).toBe("300px");
    expect(style.width).toBe("10px");
    expect(style.height).toBe("20px");
  });

  it("should allow editing the label of a created option", async () => {
    const img = wrapper.find(".image-style");

    // First click to start the selection
    await img.trigger("click", { clientX: 300, clientY: 300 });

    // Second click to end the selection
    await img.trigger("click", { clientX: 310, clientY: 320 });
    await nextTick();

    // Ensure the option label input appears and is editable
    const labelInput = wrapper.find("#option-label-0");
    expect(labelInput.exists()).toBe(true);

    await labelInput.setValue("horse");
    expect(wrapper.vm.localCollectPosition[0].label).toBe("horse");
  });
});
