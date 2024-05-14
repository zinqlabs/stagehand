import { Stagehand } from "../lib/playwright";

async function example() {
  const stageHand = new Stagehand({ env: "LOCAL" });
  await stageHand.init();
  await stageHand.page.goto("https://browserbase.com");
  await stageHand.page.close();
  await stageHand.browser.close();
}

(async () => {
  await example();
})();
