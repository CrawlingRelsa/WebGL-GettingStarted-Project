const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main.ts',
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            { test: /\.ts$/, use: 'ts-loader' },
            {
                test: /\.(vert|frag)$/,
                loader: 'shader-loader'
            }
        ],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'webglEngine.js'
    },
    mode: "development",
    plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html' })
    ]
};