import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { ScreenshotTestUtility } from "@test/ScreenshotTestUtility.ts";
import { describe, it, expect } from "vitest";
import { NavigatorTestUtility } from "@test/NavigatorTestUtility";

const testPath = "test/Extensions/RenderEngine/";
const actualFileName = "actual";
const expectedFileName = "expected";
const differenceFileName = "difference";
const pageName = "index.html";
const screenshotUtil = new NavigatorTestUtility();

const runScreenshotTestCase = async (
  testName: string,
  width: number = 800,
  height: number = 600,
) => {
  await screenshotUtil.openBrowser();
  screenshotUtil.cleanErrors();
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
  for (const error of screenshotUtil.getErrors()) {
    if (error.message.toLowerCase().indexOf("device lost") !== -1) {
      //Because this error can happen when we are freeing all resources. It's ok to ignore it.
      continue;
    }
    expect(error).toBe("");
  }
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
  it("line wireframe drawing should match the expected", async () => {
    await runScreenshotTestCase("LineDrawing");
  });
  it("text should be drawn, transformed, colored (with alpha), centered, scaled and cached", async () => {
    await runScreenshotTestCase("SimpleText");
  });
  it("mesh should be drawn correctly, transformed, colored, centered, scaled", async () => {
    await runScreenshotTestCase("MeshDrawing");
  });
  it("should render a grid with gizmos in global and local space", async () => {
    await runScreenshotTestCase("ComplexTransformations");
  });
  it("should contain multiple init without any error", async () => {
    await runScreenshotTestCase("MultipleInit");
  });
});
