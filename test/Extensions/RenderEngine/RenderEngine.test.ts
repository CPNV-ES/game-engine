import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { ScreenshotTestUtil } from "../../ScreenshotTestUtil";

const testPath = "test/Extensions/RenderEngine/";
const actualFileName = "actual.png";
const expectedFileName = "expected.png";
const differenceFileName = "difference.png";
const pageName = "index.html";
const screenshotUtil = new ScreenshotTestUtil();

beforeAll(async () => {
  await screenshotUtil.openBrowser();
});

afterAll(async () => {
  await screenshotUtil.closeBrowser();
});

const runScreenshotTestCase = async (testName: string) => {
  await screenshotUtil.takeScreenshot(
    testPath + testName + "/" + pageName,
    testPath + testName + "/" + actualFileName,
  );
  const mismatchedPixels = await screenshotUtil.imageDiff(
    testPath + testName + "/" + expectedFileName,
    testPath + testName + "/" + actualFileName,
    testPath + testName + "/" + differenceFileName,
  );
  expect(mismatchedPixels).toBe(0);
};

describe("WebGPU Rendering Test", () => {
  it("renders a WebGPU canvas correctly with one centered sprite", async () => {
    await runScreenshotTestCase("SimpleSprite");
  });
});
