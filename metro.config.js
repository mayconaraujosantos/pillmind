// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ignore problematic directories
config.watchFolders = config.watchFolders || [];
config.resolver = {
  ...config.resolver,
  blockList: [...(config.resolver?.blockList || []), /\.trunk\/.*/],
  assetExts: [
    ...(config.resolver?.assetExts || []),
    'png',
    'jpg',
    'jpeg',
    'gif',
    'svg',
    'ttf',
    'otf',
  ],
  sourceExts: [
    ...(config.resolver?.sourceExts || []),
    'js',
    'jsx',
    'ts',
    'tsx',
    'json',
  ],
};

// Exclude .trunk from watcher
config.watchFolders = config.watchFolders.filter(
  (folder) => !folder.includes('.trunk')
);

module.exports = config;
