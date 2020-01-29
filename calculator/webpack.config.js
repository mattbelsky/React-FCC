const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
      },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './src'
    },
    module: {
        rules: [
          { 
              test: /\.js$/, 
              exclude: /node_modules/, 
              use: [
                  {
                      loader: "babel-loader",
                      options: {
                          presets: [
                            '@babel/preset-env',
                            '@babel/preset-react'
                          ]
                      }
                  }
              ]
            },
            {
                test: /\.css$/,
                exclude: /(node_modules)/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
      }
}