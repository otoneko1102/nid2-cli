export interface Config {
  numDownloads: number;

  packageName: string;

  packageVersion?: string;

  maxConcurrentDownloads: number;

  downloadTimeout: number;
}
