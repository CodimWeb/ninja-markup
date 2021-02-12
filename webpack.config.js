let path = require('path');
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let HtmlWebpackPlugin = require('html-webpack-plugin');
let autoprefixer = require('autoprefixer');
let cssnano = require('cssnano');
let CopyWebpackPlugin = require('copy-webpack-plugin');
let UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env, options) => {
    let production = options.mode === 'production';

    let conf = {
        entry: './src/js/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'js/app.js',
        },
        devServer: {
            contentBase: path.join(__dirname, 'dist'),   
            overlay: true
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                },
                {
                    test: /jquery.+\.js$/,
                    use: [{
                        loader: 'expose-loader',
                        options: 'jQuery'
                    },{
                        loader: 'expose-loader',
                        options: '$'
                    }]
                },
                {
                    test: /\.scss$/,
                    use: ExtractTextPlugin.extract({
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    url: false,
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    plugins: [
                                        autoprefixer({
                                            browsers:['ie >= 8', 'last 4 version']
                                        }),
                                        cssnano ({})
                                    ],
                                    sourceMap: production ? false : 'inline'
                                }
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: true
                                }
                            },
                        ]
                    })
                },
            ]
        },
        plugins: [
            new ExtractTextPlugin("./css/style.css"),
            new HtmlWebpackPlugin({  // Also generate a test.html
                filename: 'index.html',
                template: 'src/index.html'
            }),
            //img,
            new CopyWebpackPlugin([{
                from: './src/img',
                to: './img'
              },
              {
                from: './src/fonts',
                to: './fonts'
              },
            ]),
        ],
        optimization: {
            minimizer: [new UglifyJsPlugin({
                test: /\.js(\?.*)?$/i,
                extractComments: {
                    condition: true,
                    filename() {
                        return '';
                    },
                }
            })],
        },
    }

    conf.devtool = production ? false : 'eval-sourcemap';
    return conf;
}