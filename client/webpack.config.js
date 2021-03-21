const path = require("path");
const webpack = require("webpack");

module.exports = (env,argv) => {
    const isDevelopment = argv.mode !== 'production';
    
    return {
        entry: "./src/index.js",
        mode: "development",
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: "babel-loader",
                    options: { presets: ["@babel/env"] }
                },
                {
                    test: /\.css$/,
                    use: 'css-loader'
                },
                {
                    test: /\.module\.s(a|c)ss$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                sourceMap: isDevelopment
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: isDevelopment
                            }
                        }
                    ]
                },
                {
                    test: /\.s(a|c)ss$/,
                    exclude: /\.module.(s(a|c)ss)$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: isDevelopment
                            }
                        }
                    ]
                }
            ]
        },
        resolve: { extensions: ["*", ".js", ".jsx", ".scss"] },
        output: {
            path: path.resolve(__dirname, "dist/"),
            publicPath: "/dist/",
            filename: "bundle.js"
        },
        devServer: {
            historyApiFallback: true,
            contentBase: path.join(__dirname, "src/"),
            port: 3000,
            publicPath: "http://localhost:3000/dist/",
            hotOnly: true
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
        ]
    }
}
