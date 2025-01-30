import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { ScreenshotTestUtility } from "../../ScreenshotTestUtility";

const testPath = "test/Extensions/RenderEngine/";
const actualFileName = "actual";
const expectedFileName = "expected";
const differenceFileName = "difference";
const pageName = "index.html";
const screenshotUtil = new ScreenshotTestUtility();

const runScreenshotTestCase = async (
  testName: string,
  width: number = 800,
  height: number = 600,
) => {
  await screenshotUtil.openBrowser();
  await screenshotUtil.takeScreenshot(
    testPath + testName + "/" + pageName,
    testPath +
      testName +
      "/" +
      actualFileName +
      "_" +
      width +
      "_" +
      height +
      ".png",
    width,
    height,
  );
  const mismatchedPixels = await screenshotUtil.imageDiff(
    testPath +
      testName +
      "/" +
      expectedFileName +
      "_" +
      width +
      "_" +
      height +
      ".png",
    testPath +
      testName +
      "/" +
      actualFileName +
      "_" +
      width +
      "_" +
      height +
      ".png",
    testPath +
      testName +
      "/" +
      differenceFileName +
      "_" +
      width +
      "_" +
      height +
      ".png",
  );
  expect(mismatchedPixels).toBe(0);
  await screenshotUtil.closeBrowser();
};

describe("WebGPU Rendering Test", () => {
  it("renders a WebGPU canvas correctly with one centered sprite", async () => {
    await runScreenshotTestCase("SimpleSprite");
  });
  it("one centered sprite is correctly resized", async () => {
    await runScreenshotTestCase("SimpleSprite", 640, 480);
  });
  it("sprite should move when camera is translated", async () => {
    await runScreenshotTestCase("TranslateCamera");
  });
  it("sprite should move when camera is rotated", async () => {
    await runScreenshotTestCase("RotateCamera");
  });
  it("sprite should move when it's transform is translated", async () => {
    await runScreenshotTestCase("TranslateTransform");
  });
  it("sprite should move and be rotated when it's transform is translated + rotated", async () => {
    await runScreenshotTestCase("RotateTransform");
  });
  it("sprite should correspond to text, transformed, colored, centered, scaled", async () => {
    await runScreenshotTestCase("SimpleText");
  });
});
