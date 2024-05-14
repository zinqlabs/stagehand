#!/usr/bin/env -S pnpm tsx
import { Stagehand } from "../lib/playwright";
import { expect } from "@playwright/test";

async function example() {
  const stageHand = new Stagehand({ env: "LOCAL" });
  await stageHand.init();

  await stageHand.page.goto("https://calendly.com/zerostep-test/test-calendly");

  const calendar = await stageHand.observe("find the calendar");
}

(async () => {
  await example();
})();
