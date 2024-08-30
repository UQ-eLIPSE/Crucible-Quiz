import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import TextImage from "../src/components/TextImage.vue"; // adjust the path as needed

describe("TextImage Component", () => {
  it("renders the component correctly", () => {
    const wrapper = mount(TextImage);

    expect(wrapper.find("button").exists()).toBe(true);
    expect(wrapper.find("textarea").exists()).toBe(true);
  });

  it("generates an image and emits updateTextimageSrc event", async () => {
    const testText = "This is Text for testing";
    const wrapper = mount(TextImage);
    await nextTick();

    wrapper.find("textarea").setValue(testText);
    await nextTick();
    const btn = wrapper.find("button");
    btn.trigger("click");
    const imageSrc = wrapper.vm.imageSrc;
    expect(imageSrc.startsWith("data:image/png;base64,")).toBe(true);
  });
});
