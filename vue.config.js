module.exports = {
	"devServer": {
		"proxy": "http://localhost:8080"
	},
	"outputDir": "../public",
	indexPath: process.env.NODE_ENV === 'production'
        ? '../resources/views/index.blade.php'
        : 'index.html',
	"transpileDependencies": [
		"vuetify"
	]
}
