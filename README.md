# 📊 nid2-cli

A powerful tool for simulating npm package downloads and analyzing their impact on package popularity and ranking. This tool allows developers to test how download counts affect package visibility within the npm ecosystem.

> [!NOTE]
> This project is forked from and inspired by [npm-increaser-downloads](https://github.com/MinhOmega/npm-increaser-downloads). We've enhanced it with additional features including package version specification and version verification capabilities.

## ✨ Features

- 🚀 Simulate package downloads from the npm registry
- 📦 Support for specific package versions or latest version
- ✅ Version existence verification
- 🔧 Configurable download count, concurrency, and timeout settings
- 💻 Both CLI and programmatic usage support
- 📊 Real-time progress tracking and statistics
- 🎯 Support for scoped packages
- ⚡ Optimized for various network conditions

## ⚠️ Disclaimer

This tool is intended for **educational and testing purposes only**. Artificially inflating download counts may violate npm's terms of service. Use responsibly and at your own risk.

## 🖥️ Command Line Usage

### 📥 Installation

Install `nid2-cli` globally using npm:

```bash
npm install -g nid2-cli
```

Or use with `npx`:

```bash
npx nid2
```

### 🚀 Running

You can run nid2-cli in two ways:

#### 1. Interactive mode (Recommended)

```bash
nid2
```

This will prompt you interactively for all configuration options.

#### 2. Command-line arguments

```bash
nid2 [options]
```

### 📋 Available Options

| Option | Short | Type | Required | Description |
| :-- | --- | --- | --- | :-- |
| `--package-name` | `-p` | `string` | `true` | NPM package name to simulate downloads for |
| `--package-version` | `-v` | `string` | `false` | Package version (defaults to latest if not specified) |
| `--num-downloads` | `-n` | `number` | `false` | Total number of downloads to simulate |
| `--max-concurrent-downloads` | `-m` | `number` | `false` | Maximum concurrent downloads at once |
| `--download-timeout` | `-t` | `number` | `false` | Download timeout in milliseconds |

### 📝 Usage Examples

**Interactive mode:**

```bash
nid2
```

**Simulate downloads for latest version:**

```bash
nid2 -p lodash -n 1000 -m 300 -t 3000
```

**Simulate downloads for specific version:**

```bash
nid2 -p lodash -v 4.17.21 -n 1000 -m 300 -t 3000
```

**Using long option names:**

```bash
nid2 --package-name lodash --package-version 4.17.21 --num-downloads 1000 --max-concurrent-downloads 300 --download-timeout 3000
```

**Get help:**

```bash
nid2 help
nid2 -h
```

## 🛠️ Development Setup

### 📥 Clone Repository

```bash
git clone <repository-url>
cd nid2-cli
```

### 📦 Install Dependencies

```bash
npm install
```

### 🧪 Available Scripts

| Script | Description |
| :-- | --- |
| `npm run dev` | Run in development mode with file watching |
| `npm run dev:cli` | Run CLI in development mode with file watching |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run compiled JavaScript |
| `npm test` | Run test suite with coverage |
| `npm run format` | Format code and fix linting issues |

## ⚙️ Configuration

### Default Configuration

You can set default configuration in `npm-increaser-downloads.config.ts`:

```typescript
const config: Config = {
  packageName: "my-package",
  packageVersion: "1.0.0", // Optional - omit for latest
  numDownloads: 1000,
  maxConcurrentDownloads: 300,
  downloadTimeout: 3000,
};

export default config;
```

### Configuration Options

| Property | Type | Description | Example |
| :-- | --- | :-- | --- |
| `packageName` | `string` | NPM package to simulate downloads for | `"lodash"` |
| `packageVersion` | `string` (optional) | Specific package version | `"4.17.21"` |
| `numDownloads` | `number` | Total downloads to simulate | `1000` |
| `maxConcurrentDownloads` | `number` | Parallel downloads at once | `300` |
| `downloadTimeout` | `number` | Timeout per download (ms) | `3000` |

### ⚡ Performance Tuning

For optimal performance:

- **Slower networks**: Lower `maxConcurrentDownloads` (100-200), higher `downloadTimeout` (5000-10000)
- **Fast networks**: Higher `maxConcurrentDownloads` (300-500), lower `downloadTimeout` (2000-3000)
- **Maximum throughput**: Adjust based on your bandwidth and CPU capacity

## 🎯 How It Works

1. **Package Validation**: Verifies the package exists on npm registry
2. **Version Verification**: (If specified) Confirms the requested version exists
3. **Download Simulation**: Simulates package downloads in configurable batches
4. **Progress Tracking**: Shows real-time download statistics
5. **Error Handling**: Gracefully handles failed downloads and network errors

## 📊 Output Example

```
⠙ Verifying version 4.17.21...
✔ Package version specified: 4.17.21
⠏ Downloaded: 245 | Failed: 0 | Remaining: 755
⠏ Downloaded: 490 | Failed: 0 | Remaining: 510
✔ Complete! Downloaded 1000 packages in 42.5 seconds
```

## 🔄 How npm Updates Downloads

- **Update Frequency**: Weekly (typically every Monday)
- **Visibility**: Changes may take up to 24 hours to appear on npmjs.com
- **Metrics Affected**: Trending, Popular, and Search Rankings

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit Pull Requests or open Issues.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 See Also

- [npmjs Registry](https://www.npmjs.com)
- [npm Documentation](https://docs.npmjs.com)
- [npm Trends](https://www.npmtrends.com)
