import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { ScreenshotTestUtil } from "../../ScreenshotTestUtil";

const testPath = "test/Extensions/RenderEngine/";
const actualFileName = "actual";
const expectedFileName = "expected";
const differenceFileName = "difference";
const pageName = "index.html";
const screenshotUtil = new ScreenshotTestUtil();

beforeAll(async () => {
  await screenshotUtil.openBrowser();
});

afterAll(async () => {
  await screenshotUtil.closeBrowser();
});

const runScreenshotTestCase = async (
  testName: string,
  width: number = 800,
  height: number = 600,
) => {
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
  it("one centered sprite is correctly resized", async () => {
    await runScreenshotTestCase("SimpleSprite", 640, 480);
  });
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
};

describe("WebGPU Rendering Test", () => {
  it("renders a WebGPU canvas correctly with one centered sprite", async () => {
    await runScreenshotTestCase("SimpleSprite");
  });
});
