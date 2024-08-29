// TextImageComponent.test.ts
import { render, fireEvent, screen } from "@testing-library/vue";
import { describe, it, expect, vi } from "vitest";
import TextImageComponent from "../src/components/TextImage.vue"; // Adjust the path as necessary

// Mocking Canvas
const mockCanvas = {
  getContext: vi.fn(() => mockContext),
  toDataURL: vi.fn(() => "data:image/png;base64,..."),
};

const mockContext = {
  font: "",
  fillStyle: "",
  textAlign: "",
  textBaseline: "",
  measureText: vi.fn(() => ({ width: 100 })),
  clearRect: vi.fn(),
  fillText: vi.fn(),
};

// Override global canvas
globalThis.document.createElement = vi.fn(() => mockCanvas);

describe("TextImageComponent", () => {
  it("should generate image and emit event", async () => {
    const emit = vi.fn();

    // Render the component with a mock emit function
    render(TextImageComponent, {
      global: {
        provide: {
          emit,
        },
      },
    });

    // Set text value
    const textarea = screen.getByPlaceholderText(
      "Enter question text body here...",
    );
    await fireEvent.update(textarea, "Hello\nWorld");

    // Click the button to generate the image
    const button = screen.getByText("Generate Image");
    await fireEvent.click(button);

    // Check that the canvas methods were called correctly
    expect(mockContext.font).toBe("20px Arial");
    expect(mockContext.fillStyle).toBe("black");
    expect(mockContext.textAlign).toBe("left");
    expect(mockContext.textBaseline).toBe("top");
    expect(mockContext.measureText).toHaveBeenCalledTimes(2);
    expect(mockContext.fillText).toHaveBeenCalledWith("Hello", 10, 10);
    expect(mockContext.fillText).toHaveBeenCalledWith("World", 10, 30);

    // Check that the emit function was called with the correct image source
    expect(emit).toHaveBeenCalledWith(
      "updateTextimageSrc",
      "data:image/png;base64,...",
    );
  });
});
