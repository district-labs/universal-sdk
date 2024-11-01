import { expect, test } from "vitest";

import * as connectors from "./index.js";

test("exports", () => {
  expect(Object.keys(connectors)).toMatchInlineSnapshot(`
    [
      "injected",
      "mock",
      "universalWallet",
      "metaMask",
      "safe",
      "walletConnect",
      "version",
    ]
  `);
});
