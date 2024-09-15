import { describe, it, expect } from "vitest";
import { base64ToBlob, base64ToFile } from "../src/utils"; // Adjust the import path as necessary

describe("base64ToBlob", () => {
  it("should convert base64 string to a Blob with the correct MIME type", () => {
    const base64String =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
    const mimeType = "image/png";
    const blob = base64ToBlob(base64String, mimeType);

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe(mimeType);
    expect(blob.size).toBeGreaterThan(0);
  });
});

describe("base64ToFile", () => {
  it("should convert base64 string to a File with the correct name and MIME type", () => {
    const base64String =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
    const fileName = "test.png";
    const file = base64ToFile(base64String, fileName);

    expect(file).toBeInstanceOf(File);
    expect(file.name).toBe(fileName);
    expect(file.type).toBe("image/png");
    expect(file.size).toBeGreaterThan(0);
  });
});
