var path = require('path');
var webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	devtool: 'null',
	entry: [ './src/main.js' ],
	output: {
		path: path.join(__dirname, 'public'),
		filename: 'bundle-[hash].js' //可以達到緩存的功效
	},

	devServer: {
		contentBase: './public', //頁面所在的位置
		port: 4000,
		inline: true, // 文件改變時自動刷新
		hot: true,
		historyApiFallback: true //不跳转
	},

	optimization: {
		minimizer: [
			// minify js檔案大小
			new UglifyJsPlugin({
				uglifyOptions: {
					warnings: false
				}
			})
		]
	},

	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.BannerPlugin('版權所有'), // 編譯的js最上面會有此文字標示
		new webpack.HotModuleReplacementPlugin(), //热加载插件
		new ExtractTextPlugin('main.css'), // 將css & JS 分離
		new HtmlWebpackPlugin({
			template: __dirname + '/public/index.tmpl.html'
			//http://www.cnblogs.com/haogj/p/5160821.html
		})
	],

	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader',
						options: {
							modules: true, // 指定启用css modules
							localIdentName: '[name]__[local]--[hash:base64:5]' // 指定css的类名格式 ([檔名]__[css類]--[hash])
						}
					},
					{
						loader: 'postcss-loader'
					}
				]
			},
			{
				test: /\.scss$/,
				use: [ 'style-loader', 'css-loader', 'resolve-url-loader', 'sass-loader?sourceMap' ]
			},
			{
				test: /(\.js|\.jsx)$/,
				use: {
					loader: 'babel-loader'
					// options: {
					// 	presets: [ 'env', 'react' ]
					// }
				},
				exclude: /node_modules/
			}
		]
	}
};
