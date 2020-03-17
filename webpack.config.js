var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
module.exports = {
    entry: './src/main.js',
    mode: "development",
    node: {
        fs: 'empty'
    },
    // target: 'node',
    output: {
        path: path.resolve(__dirname, 'public/js/'),
        filename: 'bundle.js'
    },
    externals: ["react", /^@angular/],
    // Don't follow/bundle these modules, but request them at runtime from the environment
    serve: { //object
        port: 1337,
        content: './dist',
        // ...
    },
    module: {
        rules: [
            {
                test: /.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            }
        ]
    }
};