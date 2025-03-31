import { createServer } from "vite";
import puppeteer, { Browser, Page } from "puppeteer";
import fs from "fs";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

export class NavigatorTestUtility {
  private _browser: Browser | null = null;
  private _page: Page | null = null;
  private _errors: Error[] = []; // Array to store errors

  /**
   * Launch the browser instance (before all tests are done)
   */
  public async openBrowser() {
    // Launch the browser
    this._browser = await puppeteer.launch();
    this._page = await this._browser.newPage();

    // Listen for page errors
    this._page.on("pageerror", (error) => {
      this.addError(error);
      console.error("Browser Page error:", error);
    });

    // Listen for console errors
    interface BrowserError {
      message?: string;
      stack?: string;
      // Add other possible error properties if needed
      [key: string]: unknown;
    }

    this._page.on("console", async (message) => {
      if (message.type() === "error") {
        try {
          const args = await Promise.all(
            message.args().map((arg) => arg.jsonValue()),
          );

          // Type guard to check if first arg is an error-like object
          const getErrorDetails = (arg: unknown): BrowserError => {
            if (typeof arg === "object" && arg !== null) {
              return {
                message: "message" in arg ? String(arg.message) : undefined,
                stack: "stack" in arg ? String(arg.stack) : undefined,
              };
            }
            return {};
          };

          const errorDetails = getErrorDetails(args[0]);
          const errorMessage = errorDetails.message || message.text();

          const error = new Error(errorMessage);
          error.stack =
            errorDetails.stack ||
            `At: ${message.location().url}:${message.location().lineNumber}`;

          this.addError(error);
          console.error("Browser Error", {
            message: error.message,
            stack: error.stack,
            location: message.location(),
            rawArgs: args, // For debugging
          });
        } catch (err) {
          console.error("Failed to process console error:", err);
        }
      }
    });
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
    timeToWait: number = 500,
    devPort: number = 8081,
  ) {
    if (this._browser === null || this._page === null) {
      throw new Error(
        "Browser or page is not initialized. You need to call openBrowser() first.",
      );
    }

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
   * Get all errors captured during the test
   * @returns An array of errors
   */
  public getErrors(): Error[] {
    return this._errors;
  }

  /**
   * Clean all errors captured during the test
   */
  public cleanErrors() {
    this._errors = [];
  }

  /**
   * Destroy the browser instance (after all tests are done)
   */
  public async closeBrowser() {
    if (this._browser === null) {
      throw new Error(
        "Browser is not initialized. You need to call openBrowser() first.",
      );
    }
    await this._browser.close();
    this._browser = null;
    this._page = null;
    this._errors = [];
  }

  private addError(error: Error): void {
    if (error.message.indexOf("Failed to load resource:") !== -1) return;
    this._errors.push(error);
  }
}
