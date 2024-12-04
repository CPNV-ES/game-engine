import { createServer, ViteDevServer } from "vite";
import puppeteer from "puppeteer";
import fs from "fs";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

/**
 * Utility class to take screenshots of a page and compare them with expected images
 */
export class ScreenshotTestUtility {
  private _browser: puppeteer.Browser;
  private _page: puppeteer.Page;

  /**
   * Launch the browser instance (before all tests are done)
   */
  public async openBrowser() {
    // Launch the browser
    this._browser = await puppeteer.launch();
    this._page = await this._browser.newPage();
  }

  /**
   * Take a screenshot of the page (launch the server and browser)
   * @param pageRootPath - The root path of the page to launch the server + browser
   * @param screenshotPath - The path to save the screenshot (PNG)
   * @param timeToWait - The time to wait (in ms) before taking the screenshot
   * @param devPort - The port to launch the server on (default: 8081). You need to be certain that this port is not in use.
   */
  public async takeScreenshot(
    pageRootPath: string,
    screenshotPath: string,
    width: number = 800,
    height: number = 600,
    timeToWait: number = 100,
    devPort: number = 5171,
  ) {
    // Remove the existing file if it exists
    if (fs.existsSync(screenshotPath)) {
      fs.unlinkSync(screenshotPath);
    }

    const server = await createServer({
      root: "./",
      server: { port: devPort },
    });
    await server.listen();

    await this._page.goto("http://localhost:" + devPort + "/" + pageRootPath);
    await this._page.setViewport({ width: width, height: height });
    await this._page.waitForSelector("#app");
    await new Promise((resolve) => setTimeout(resolve, timeToWait));

    await this._page.screenshot({ path: screenshotPath });

    await server.close();
  }

  /**
   * Compare two images (PNG) and save the diff
   * @param expectedImagePath - The path to the expected image
   * @param actualImagePath - The path to the actual image
   * @param diffPath - The path to save the diff image
   * @returns The number of mismatched pixels
   */
  public async imageDiff(
    expectedImagePath: string,
    actualImagePath: string,
    diffPath: string,
  ): Promise<number> {
    const expectedBuffer = fs.readFileSync(expectedImagePath);
    const expectedImage = PNG.sync.read(expectedBuffer);
    const actualBuffer = fs.readFileSync(actualImagePath);
    const actualImage = PNG.sync.read(actualBuffer);

    const { width, height } = expectedImage;
    const diff = new PNG({ width, height });
    const mismatchedPixels = pixelmatch(
      expectedImage.data,
      actualImage.data,
      diff.data,
      width,
      height,
      { threshold: 0.05 },
    );

    fs.writeFileSync(diffPath, PNG.sync.write(diff));

    return mismatchedPixels;
  }

  /**
   * Destroy the browser instance (after all tests are done)
   */
  public async closeBrowser() {
    await this._browser.close();
  }
}
