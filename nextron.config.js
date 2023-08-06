const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');
const cwd = process.cwd();

module.exports = {
    // specify an alternate main src directory, defaults to 'main'
    mainSrcDir: 'backend',
    // specify an alternate renderer src directory, defaults to 'renderer'
    rendererSrcDir: 'frontend',

    // main process' webpack config
    webpack: (config, env) => {
        config.resolve.plugins = [
            new TsconfigPathsPlugin({ configFile: path.resolve(cwd, 'tsconfig.json')})
        ];
        config.entry = {
            background: './backend/background.ts',
        };

        // do some stuff here
        return config;
    },
};
