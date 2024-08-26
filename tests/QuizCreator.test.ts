import { describe, it, expect, beforeEach } from "vitest";
import { VueWrapper, mount } from "@vue/test-utils";
import QuizEdit from "../src/components/QuizEdit.vue";
import { nextTick } from "vue";
import testImageUrl from "../src/assets/TestDD.png";

describe("YourComponent", () => {
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
  it("should add position marker on image click", async () => {
    const img = wrapper.find(".image-style");

    await img.trigger("mousedown", { clientX: 300, clientY: 300 });

    await nextTick();
    await img.trigger("mousedown", { clientX: 310, clientY: 320 });
    const positions = wrapper.findAll(".option-item-position");

    const style1 = window.getComputedStyle(positions[0].element as HTMLElement);
    const style2 = window.getComputedStyle(positions[1].element as HTMLElement);

    expect(positions.length).toBe(2);
    expect(style1.top).toBe("300px");
    expect(style2.top).toBe("320px");
  });

  it("The description of an option(option label) is editable", async () => {
    const img = wrapper.find(".image-style");
    await img.trigger("mousedown", { clientX: 300, clientY: 300 });
    await nextTick();
    const labelInput = wrapper.find("#option-label-0");
    expect(labelInput.exists()).toBe(true);
    labelInput.setValue("horse");
    expect(wrapper.vm.collectPosition[0].label).toBe("horse");
  });
});
