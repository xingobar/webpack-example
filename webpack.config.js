var path = require('path');
var webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
	devtool: 'eval-source-map',
	entry: [ './src/main.js' ],
	output: {
		path: path.join(__dirname, 'build'),
		filename: 'bundle-[hash].js' //可以達到緩存的功效
	},

	devServer: {
		contentBase: './public', //頁面所在的位置
		port: 4000,
		inline: true, // 文件改變時自動刷新
		hot: true
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
		
		// 編譯的js最上面會有此文字標示
		new webpack.BannerPlugin('版權所有'), 
		
		//熱加載
		new webpack.HotModuleReplacementPlugin(),
		
		// 將css & JS 分離,將分離出來的css，命名為 style.css
		new ExtractTextPlugin('style.css'), 
		
		//使用樣板會自動套用js以及css
		//Ref: http://www.cnblogs.com/haogj/p/5160821.html
		new HtmlWebpackPlugin({
			template: __dirname + '/public/index.tmpl.html'
		}),

		// 因為增加了緩存功能(hash),所以檔案會一直增加，因此用此套件在build前，
		// 將build資料夾下的所有檔案移除
		new CleanWebpackPlugin('build/*.*',{
			dry:false, // not emulate delete 
			verbose:false, // not show console
			root:__dirname, // root of your package
		})
	],

	module: {
		rules: [
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								modules: true, // 指定启用css modules
								localIdentName: '[name]__[local]--[hash:base64:5]' // 指定css的类名格式
							}
						},
						{
							loader: 'postcss-loader'
						}
					]
				})
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
