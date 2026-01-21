#!/usr/bin/env node

import yargs, { Arguments } from "yargs";
import { hideBin } from "yargs/helpers";
import { setConfig } from "./config";
import { Config } from "./models/config.model";
import { run } from "./spammer/spammer";
import defaultConfig from "../npm-increaser-downloads.config";

const argv = yargs(hideBin(process.argv))
  .usage(
    "Usage: nid [options]\n\n" +
      "Note: if no options are provided, nid will prompt for input interactively.\n\n" +
      "For advanced configuration, use npm-increaser-downloads.config.ts in the root directory.\n" +
      "See also the sample: https://github.com/MinhOmega/npm-increaser-downloads#readme\n\n" +
      "Examples:\n\n" +
      "  $ nid\n" +
      "  $ nid -p my-package -n 1000 -m 300 -t 3000\n" +
      "  $ nid -p my-package -v 1.0.0 -n 1000 -m 300 -t 3000\n" +
      "  $ nid --package-name my-package --num-downloads 1000 --max-concurrent-downloads 300 --download-timeout 3000\n\n" +
      "All options are documented under: nid help",
  )
  .option("package-name", {
    alias: "p",
    type: "string",
    description: "NPM package to increase the downloads of",
    requiresArg: true,
  })
  .option("package-version", {
    alias: "v",
    type: "string",
    description: "Version to increase the downloads of",
  })
  .option("num-downloads", {
    alias: "n",
    type: "number",
    description: "Number of times to download the package",
  })
  .option("max-concurrent-downloads", {
    alias: "m",
    type: "number",
    description: "Amount of downloads to run in parallel at once",
  })
  .option("download-timeout", {
    alias: "t",
    type: "number",
    description: "Max time (in ms) to wait for a download to complete",
  })
  .help()
  .alias("help", "h")
  .epilogue("For more information, visit https://github.com/MinhOmega/npm-increaser-downloads").argv;

const runWithArgs = (
  args: Arguments<{
    "package-name"?: string;
    "package-version"?: string;
    "num-downloads"?: number;
    "max-concurrent-downloads"?: number;
    "download-timeout"?: number;
  }>,
) => {
  if (!args["package-name"]) {
    // 対話型に遷移
    import("./cli/prompts").then(({ getConfigFromCli }) => {
      getConfigFromCli().then(setConfig).then(run);
    });
    return;
  }

  const config: Config = {
    packageName: args["package-name"],
    packageVersion: args["package-version"] ?? undefined,
    numDownloads: args["num-downloads"] ?? defaultConfig.numDownloads,
    maxConcurrentDownloads: args["max-concurrent-downloads"] ?? defaultConfig.maxConcurrentDownloads,
    downloadTimeout: args["download-timeout"] ?? defaultConfig.downloadTimeout,
  };

  setConfig(config);
  run();
};

runWithArgs(
  argv as Arguments<{
    "package-name"?: string;
    "package-version"?: string;
    "num-downloads"?: number;
    "max-concurrent-downloads"?: number;
    "download-timeout"?: number;
  }>,
);
