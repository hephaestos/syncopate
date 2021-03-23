const path = require('path');

module.exports = (env, argv) => {
    const isDevelopment = argv.mode !== 'production';

    return {
        entry: './src/index.jsx',
        mode: 'development',
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /(node_modules|bower_components|dist)/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: { presets: ['@babel/env'] },
                        },
                        'eslint-loader',
                    ],
                },
                {
                    test: /\.html$/,
                    loader: 'html-loader',
                },
                {
                    test: /\.(gif|png|jpe?g|svg)$/i,
                    use: [
                        'file-loader',
                        {
                            loader: 'image-webpack-loader',
                            options: {
                                mozjpeg: {
                                    progressive: true,
                                    quality: 65,
                                },
                                optipng: {
                                    enabled: !isDevelopment,
                                },
                                gifsicle: {
                                    interlaced: false,
                                },
                                webp: {
                                    quality: 75,
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.module\.s(a|c)ss$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                sourceMap: isDevelopment,
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: isDevelopment,
                            },
                        },
                    ],
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
                                sourceMap: isDevelopment,
                            },
                        },
                    ],
                },
            ],
        },
        resolve: { extensions: ['*', '.js', '.jsx', '.scss'] },
        output: {
            path: path.resolve(__dirname, 'dist/'),
            publicPath: '/dist/',
            filename: 'bundle.js',
        },
        devServer: {
            historyApiFallback: true,
            contentBase: path.join(__dirname, 'src/'),
            port: 3000,
            publicPath: 'http://localhost:3000/dist/',
        },
    };
};
