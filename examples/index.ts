import { Stagehand } from "../lib/playwright";
import { chromium } from "playwright-core";

async function example() {
  const stageHand = new Stagehand(chromium);
  console.log("Hello, world!");
}

(async () => {})();
