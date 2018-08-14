var path = require('path');
var webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // npm install extract-text-webpack-plugin@next
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
	devtool: 'source-map',
	entry: [ './src/main.js' ],
	output: {
		path: path.join(__dirname, 'build'),
		filename: 'bundle-[hash].js' //可以達到緩存的功效
	},

	devServer: {
		contentBase: './public', //頁面所在的位置
		port: 4000,
		inline: true, // 文件改變時自動刷新
		hot: true,
		// publicPath:'/build' //假如頁面跟js在不一樣的位置的話，要指定讀取JS的位置
	},

	optimization: {
		minimizer: [
			// minify js檔案大小
			new UglifyJsPlugin({
				sourceMap: true,
				uglifyOptions: {
					warnings: false,
					compress:true
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
		
		// 將css & JS 分離,將分離出來的css，命名為 style-[hash].css
		new ExtractTextPlugin({
			filename:'style-[hash].css'
		}), 
		
		//使用樣板會自動套用js以及css
		//Ref: http://www.cnblogs.com/haogj/p/5160821.html
		new HtmlWebpackPlugin({
			template: __dirname + '/public/index.tmpl.html'
		}),

		// 因為增加了緩存功能(hash),所以檔案會一直增加，因此用此套件在build前，
		// 將build資料夾下的所有檔案移除
		new CleanWebpackPlugin('build',{
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
				// use: [ 'style-loader', 'css-loader', 'resolve-url-loader', 'sass-loader?sourceMap' ]
				use: [
					{
						loader:'style-loader'
					},
					{
						loader:'css-loader',
						options:{
							sourceMap:true
						}
					},
					{
						loader:'sass-loader',
						options:{
							sourceMap:true
						}
					}
				]
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
			},
			{
				test:/\.(png|jpg|jpeg|gif)$/,
				use:[
					{
						loader:'file-loader',
						options:{
							name:'assets/[name]-[hash:5].[ext]' // 檔名-hash.副檔名
						},
					},
					{
						loader:'image-webpack-loader' //圖片壓縮
					}
				]
				
				// use:{
				// 	loader:'url-loader',
				// 	options:{
				// 		limit:8192,
				//	    name:'assets/[name]-[hash:5].[ext]',
				//	    outputPath:'assets/',
				//		publicPath:'/assets/',
				// 		fallback:[ //圖片大於8192時，交給file-loader
				// 			'file-loader',
				// 			{
				// 				loader:'image-webpack-loader'
				// 			}
				// 		]
				// 	}
				// }
			}
		]
	}
};
