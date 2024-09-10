import { describe, it, expect, beforeEach } from "vitest";
import { VueWrapper, mount } from "@vue/test-utils";
import QuizEdit from "../src/components/QuizEdit.vue";
import { nextTick } from "vue";
import testImageUrl from "../src/assets/TestDD.png";

describe("QuizEdit", () => {
  let wrapper: VueWrapper;
  const imgWidth = 600;
  const imgHeight = 600;

  beforeEach(async () => {
    wrapper = mount(QuizEdit, {
      context: { props: { imageUrl: testImageUrl } },
    });
    await nextTick();
    // mock img.getBoundingClientRect
    const img = wrapper.find(".image-style");
    img.element.getBoundingClientRect = () => ({
      top: 0,
      left: 0,
      width: imgWidth,
      height: imgHeight,
      x: 0,
      y: 0,
      right: 1000,
      bottom: 1000,
      toJSON: () => {},
    });
  });

  it("should found image", async () => {
    expect(wrapper.find("img").exists()).toBe(true);
  });

  it("should add position marker on two image clicks", async () => {
    const img = wrapper.find(".image-style");

    // First click to start the selection
    const [initialX, initialY] = [300, 300];
    await img.trigger("click", { clientX: initialX, clientY: initialY });

    // Ensure the selection start was registered
    await nextTick();
    expect(wrapper.vm.isSelecting).toBe(true);

    // Second click to end the selection
    const [finalX, finalY] = [310, 320];
    await img.trigger("click", { clientX: finalX, clientY: finalY });

    // Ensure the selection was finalized
    await nextTick();
    const positions = wrapper.findAll(".option-item-position");
    expect(positions.length).toBe(1);

    const style = window.getComputedStyle(positions[0].element as HTMLElement);
    expect(style.top).toBe(`${(initialY / imgHeight) * 100}%`);
    expect(style.left).toBe(`${(initialX / imgWidth) * 100}%`);
    expect(style.width.replace("%", "")).toBeCloseTo(
      ((finalX - initialX) / imgWidth) * 100,
      2,
    );
    expect(style.height.replace("%", "")).toBeCloseTo(
      ((finalY - initialY) / imgHeight) * 100,
      2,
    );
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
    expect(wrapper.vm.collectPosition[0].label).toBe("horse");
  });
});
