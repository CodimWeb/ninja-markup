const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env, options) => {
    let production = options.mode === 'production';

    let conf = {
        entry: './src/js/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'js/app-[hash].js',
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
                    use: [
                      { loader: MiniCssExtractPlugin.loader },
                      {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            sourceMap: true
                        }
                      },
                      {
                        loader: 'postcss-loader',
                        options: {
                          plugins: () => [require('autoprefixer')({
                            'browsers': ['> 1%', 'last 2 versions']
                          })],
                          sourceMap: true
                        }
                      },
                      {
                        loader: 'sass-loader',
                        options: {
                          sourceMap: true
                        }
                      }
                    ]
                  }
            ]
        },
        plugins: production ? [
            new CleanWebpackPlugin(),
            new CopyWebpackPlugin([
                {
                    from: './src/img',
                    to: './img'
                },
                {
                    from: './src/fonts',
                    to: './fonts'
                },
            ]),
            new MiniCssExtractPlugin({
                filename: "./css/style-[hash].css"
            }),
            new HtmlWebpackPlugin({  // Also generate a test.html
                filename: 'home.html',
                template: 'src/home.html'
            }),
            new HtmlWebpackPlugin({
                filename: 'sales.html',
                template: 'src/sales.html'
            }),
            new HtmlWebpackPlugin({
                filename: 'about.html',
                template: 'src/about.html'
            }),
            new HtmlWebpackPlugin({
                filename: 'order.html',
                template: 'src/order.html'
            }),
            new HtmlWebpackPlugin({
                filename: 'order-accept.html',
                template: 'src/order-accept.html'
            }),
            new HtmlWebpackPlugin({
                filename: 'delivery.html',
                template: 'src/delivery.html'
            }),
            
        ] : 
        [
            new CopyWebpackPlugin([
                {
                    from: './src/img',
                    to: './img'
                },
                {
                    from: './src/fonts',
                    to: './fonts'
                },
            ]),
            new MiniCssExtractPlugin({
                filename: "./css/style-[hash].css"
            }),
            new HtmlWebpackPlugin({  // Also generate a test.html
                filename: 'home.html',
                template: 'src/home.html'
            }),
            new HtmlWebpackPlugin({
                filename: 'sales.html',
                template: 'src/sales.html'
            }),
            new HtmlWebpackPlugin({
                filename: 'about.html',
                template: 'src/about.html'
            }),
            new HtmlWebpackPlugin({
                filename: 'order.html',
                template: 'src/order.html'
            }),
            new HtmlWebpackPlugin({
                filename: 'order-accept.html',
                template: 'src/order-accept.html'
            }),
            new HtmlWebpackPlugin({
                filename: 'delivery.html',
                template: 'src/delivery.html'
            }),
            
        ]
        ,
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

    // conf.devtool = production ? false : 'eval-sourcemap';
    conf.devtool = production ? false : 'inline-source-map';
    return conf;
}