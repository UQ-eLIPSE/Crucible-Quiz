import { describe, it, expect, beforeEach } from "vitest";
import { VueWrapper, mount } from "@vue/test-utils";
import QuizCreator from "../src/components/DraggableBox.vue";
import { nextTick } from "vue";

describe("YourComponent", () => {
  let wrapper: VueWrapper;
  const testImageUrl = "src/assets/TestDD.png";
  beforeEach(() => {
    wrapper = mount(QuizCreator, {
      global: { provide: { imageSrc: testImageUrl } },
    });
  });

  // it("should update imageSrc when a file is uploaded", async () => {
  //   const file = new File(["dummy content"], "example.png", {
  //     type: "image/png",
  //   });
  //   const input = wrapper.find('input[type="file"]');
  //   await input.trigger("change", { target: { files: [file] } });

  //   await nextTick();

  //   const img = wrapper.find("img");
  //   expect(img.attributes("src")).toBeTruthy();
  // });

  it("should add position marker on image click", async () => {
    const img = wrapper.find(".image-style");
    console.log("img", img);
    await img.trigger("mousedown", { clientX: 300, clientY: 300 });

    await nextTick();
    await img.trigger("mousedown", { clientX: 310, clientY: 320 });
    const positions = wrapper.findAll(".option-item-position");
    console.log("position: ", wrapper.vm.collectPosition);
    expect(positions.length).toBe(1);
  });

  it("should remove position marker when clicked", async () => {
    const img = wrapper.find("img");
    await img.trigger("mousedown", { clientX: 100, clientY: 150 });
    await nextTick();

    const position = wrapper.find(".option-item-position");
    await position.trigger("click");
    await nextTick();

    const positions = wrapper.findAll(".option-item-position");
    expect(positions.length).toBe(0);
  });
});
