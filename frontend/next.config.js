const path = require("path")
const cwd = process.cwd()
const folderPaths = [
  path.resolve(cwd, 'frontend'),
  path.resolve(cwd, 'common'),
]

const rules = [
  {
    test: /\.ts$/,
    exclude: /^node_modules/,
    loader: "ts-loader",
    include: [ folderPaths ],
    options: {
      transpileOnly: true
    }
  },
  {
    test: /\.node$/,
    loader: "node-loader",
  },
]

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = 'electron-renderer';
    }

    config.module.rules = [ ...config.module.rules, ...rules ]
    config.resolve.extensions = [ ...config.resolve.extensions, '.ts', '.tsx' ]

    return config;
  },
};
