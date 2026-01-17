import { GaxiosError, GaxiosResponse, request } from "gaxios";
import { logComplete, logDownload, logError } from "../cli/logger";
import { getConfig } from "../config";
import { NpmjsResponse } from "../models/npmjs-response.model";
import { NpmsioResponse } from "../models/npmsio-response.model";
import { Stats } from "../models/stats.model";
import { getEncodedPackageName, stripOrganisationFromPackageName } from "./utils";
import { terminalSpinner } from "../cli/logger";

export const getNpmsioResponse = async () => {
  const encodedPackageName: string = getEncodedPackageName(getConfig().packageName);

  const npmsioResponse: GaxiosResponse<NpmsioResponse> = await request<NpmsioResponse>({
    baseUrl: "https://api.npms.io",
    url: `/v2/package/${encodedPackageName}`,
    method: "GET",
  }).catch((response: GaxiosError<NpmsioResponse>) => {
    throw Error(`Failed to download ${response.config.url}\n${response.message}`);
  });

  return npmsioResponse.data;
};

export const getNpmjsResponse = async (): Promise<NpmjsResponse> => {
  const encodedPackageName: string = getEncodedPackageName(getConfig().packageName);

  const npmsResponse: GaxiosResponse<NpmjsResponse> = await request<NpmjsResponse>({
    baseUrl: "https://registry.npmjs.org",
    url: `/${encodedPackageName}/latest`,
    method: "GET",
  }).catch((response: GaxiosError<NpmjsResponse>) => {
    throw Error(`Failed to download ${response.config.url}\n${response.message}`);
  });

  return npmsResponse.data;
};

export const getVersionPackage = async (): Promise<string> => {
  try {
    terminalSpinner.start();
    const npmioResponse = await getNpmsioResponse();
    terminalSpinner.succeed(`Package version found on npms.io with version ${npmioResponse.collected.metadata.version}`);
    return npmioResponse.collected.metadata.version;
  } catch (npmioError) {
    terminalSpinner.text = "Package not found in npms.io, trying npmjs.com...";
    try {
      const npmjsResponse = await getNpmjsResponse();
      terminalSpinner.succeed(`Package found on npmjs.com with version ${npmjsResponse.version}`);
      return npmjsResponse.version;
    } catch (npmjsError) {
      terminalSpinner.fail("Failed to get package version");
      throw new Error(`Failed to get package version: ${npmioError.message}, ${npmjsError.message}`);
    }
  }
}

export const verifyVersionExists = async (version: string): Promise<boolean> => {
  const encodedPackageName: string = getEncodedPackageName(getConfig().packageName);
  
  try {
    await request<NpmjsResponse>({
      baseUrl: "https://registry.npmjs.org",
      url: `/${encodedPackageName}/${version}`,
      method: "GET",
    });
    return true;
  } catch {
    return false;
  }
};

export const downloadPackage = async (version: string, stats: Stats): Promise<unknown> => {
  const packageName: string = getConfig().packageName;
  const unscopedPackageName: string = stripOrganisationFromPackageName(packageName);

  return request<unknown>({
    baseUrl: "https://registry.yarnpkg.com",
    url: `/${packageName}/-/${unscopedPackageName}-${version}.tgz`,
    method: "GET",
    timeout: getConfig().downloadTimeout,
    responseType: "stream",
  })
    .then(() => {
      stats.successfulDownloads++;
    })
    .catch((error) => {
      stats.failedDownloads++;
      console.error("Download failed:", error.message);
    });
};

const spamDownloads = async (version: string, stats: Stats): Promise<void> => {
  const batchSize = Math.min(getConfig().maxConcurrentDownloads, 50); // Limit to 50 concurrent downloads
  const totalDownloads = getConfig().numDownloads;

  for (let i = 0; i < totalDownloads; i += batchSize) {
    const batch = Math.min(batchSize, totalDownloads - i);
    const requests: Promise<unknown>[] = [];

    for (let j = 0; j < batch; j++) {
      requests.push(downloadPackage(version, stats));
    }

    await Promise.all(requests);

    // Add a small delay between batches to allow for connection cleanup
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
};

/**
 * Runs the download spammer.
 * @returns A Promise that resolves when the spamming is complete.
 */
export const run = async (): Promise<void> => {
  try {
    let version: string;
    const pkgVersion = getConfig().packageVersion;
    if (pkgVersion) {
      terminalSpinner.start();
      terminalSpinner.text = `Verifying version ${pkgVersion}...`;
      const versionExists = await verifyVersionExists(pkgVersion);
      if (!versionExists) {
        terminalSpinner.fail(`Version ${pkgVersion} not found`);
        throw new Error(`Package version ${pkgVersion} does not exist on npm registry`);
      }
      version = pkgVersion;
      terminalSpinner.succeed(`Package version specified: ${version}`);
    } else {
      version = await getVersionPackage();
    }
    const startTime: number = Date.now();
    const stats: Stats = new Stats(startTime);

    const loggingInterval: NodeJS.Timeout = setInterval(() => logDownload(stats), 1000);
    await spamDownloads(version, stats);

    clearInterval(loggingInterval);
    logComplete();
  } catch (e: unknown) {
    logError(e as Error);
  }
};
