// SPDX-License-Identifier: Apache-2.0

import type { Config } from "jest";

const config: Config = {
  collectCoverage: true,
  collectCoverageFrom: ["**/src/**/*.ts"],
  coverageProvider: "v8",
  preset: "ts-jest",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};

export default config;
