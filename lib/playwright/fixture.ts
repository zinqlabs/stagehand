import {
  type Page,
  type Browser,
  type BrowserContext,
  test as base,
  chromium,
} from "@playwright/test";
import { Stagehand } from "./index";
import { evictCache } from "../cache";

type Fixture = {
  stagePage: Stagehand;
};

export const stagehandFixture = base.extend<Fixture>({
  stagePage: async ({ page, context, browser }, use) => {
    if (process.env.BROWSERBASE_API_KEY && process.env.local !== "1") {
      console.log("Browserbase key detected, connecting you to a browser...");
      const browser = await chromium.connectOverCDP(
        `wss://api.browserbase.com?apiKey=${process.env.BROWSERBASE_API_KEY}`
      );
      const context = browser.contexts()[0];

      console.log("connected, happy browsing!");
      const bbPage = new Stagehand(page, browser, context);
      await use(bbPage);
    } else {
      console.log("running tests locally...");
      const bbPage = new Stagehand(page, browser, context);
      await use(bbPage);
    }
  },
});

stagehandFixture.afterAll(async ({ browser }) => {
  if (process.env.local !== "1") {
    console.log("tests finished... disconnecting from Browserbase");
    await browser.close();
    console.log("disconnected from Browserbase");
  }
});

stagehandFixture.afterEach(async ({ stagePage }) => {
  console.log("test status: ", stagehandFixture.info().status);
  if (stagehandFixture.info().status !== "passed") {
    console.log("evicting cache key: ", stagePage.testKey);
    evictCache(stagePage.testKey);
    console.log("cache evicted");
  }
});

stagehandFixture.beforeEach(
  "capture test info",
  async ({ stagePage }, info) => {
    stagePage.setTestKey(info.titlePath.join(".").replace(/\s/g, "_"));
  }
);
