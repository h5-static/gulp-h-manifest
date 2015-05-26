var fs = require("fs");
var makeArray = require("make-array");
var DIR_NANME;
var cssLinkRxg = /<link\s+(?:rel\=[\"\']stylesheet[\"\']\s+)?(?:type\=[\"\']text\/css[\"\']\s+)?href\=[\"\']\{{3}([\w\.\/\'\"\s\-]+)\}{3}[\"\']\s*\/>/g,
	hrefRxg = /\{{3}\s*static\s*[\'\"]([\w\.\/\s\-]+)[\'\"]\s*\}{3}/,
	imgHrefRxg = /<img\s+src\=[\'\"]\{{3}static\s+[\'\"]([\w\.\/\'\"\s\-]+)[\'\"]\s*\}{3}[\'\"]\s*\/>/g,
	bgHrefRxg = /url\([\'\"]?([\w\.\/\s\-]+)[\'\"]?\)/g,
	bgSrcRxg = /url\([\'\"]?([\w\.\/\s\-]+)[\'\"]?\)/;

function readHTMLFile(file){	
	var fileStream = file;
	var cssLinkArr = fileStream.match(cssLinkRxg);
	var img2HTMLLinkArr = fileStream.match(imgHrefRxg);

	//html中所有的css路径
	var css2HtmlArr = readLink(cssLinkArr);

	var cssArr = readLink(cssLinkArr).map(function(item){
		return item.link;
	})

	//html路径
	var htmlArr = makeHtmlArr(file);

	//html中所用的img路径
	var img2HtmlArr = readLink(img2HTMLLinkArr);

	var imgArr = img2HtmlArr.map(function(item){
		return item.link
	})

	//css中所有的img路径
	var img2CssArr = readImg2Css(css2HtmlArr);

	imgArr = imgArr.concat(img2CssArr);


	//cortex.js中依赖的js
	var jsArr = readJson();

	var maps = concatArr(cssArr, imgArr, jsArr, htmlArr);

	var cachename = file.replace("html","appcache");

	//writeFile(cachename, maps)
	var data = "CACHE MANIFEST\n";

	maps.forEach(function(item){
		data += item + "\n";
	})

	data += "NETWORK:\n*\n"

	return new Buffer(data);


}

function readImg2Css(arr){
	var imgArr = [], imgStrArr = [];
	arr.forEach(function(item){

		var csslink = "",
			cssLinkArr = item.path.split("/");

		for(var i = 0; i< cssLinkArr.length; i++){
			if(cssLinkArr[i] != ".."){
				csslink += "/" + cssLinkArr[i];
			}
		}

		var cssStream = fs.readFileSync(__dirname + csslink,"utf-8");
		var imgSrcArr = cssStream.match(bgHrefRxg);

		makeArray(imgSrcArr).forEach(function(item){

			if(imgArr.indexOf(bgSrcRxg.exec(item)[1]) == -1){
				imgArr.push(bgSrcRxg.exec(item)[1]);
			}

		})
	})

	makeArray(imgArr).forEach(function(item){
		imgStrArr.push("{{{static '" + item + "'}}}");
	})

	return imgStrArr;
}

function makeHtmlArr(file){

	var arr = [];
	var midArr = file.split("/");
	arr.push("./" + midArr[midArr.length - 1] + "/" +new Date().getTime());

	return arr;

}

function readJson(){

	var jsArr = []
	var dependencies = JSON.parse(fs.readFileSync(__dirname+ "/../cortex.json","utf-8")).dependencies;

	for(var i in dependencies){
		jsArr.push("{{{modfile '" + i + "'}}}");
	}

	return jsArr;

}

function concatArr(){
	var arr = []
	for(var i = 0 ;i < arguments.length; i++){
		arr = arr.concat(arguments[i]);
	}

	return arr;

}

function readLink(arr){
	
	var newArr = [];

	makeArray(arr).forEach(function(item){

		var nameArr = hrefRxg.exec(item)[1].split("/"),
			name = nameArr[nameArr.length - 1];

		newArr.push({"link": hrefRxg.exec(item)[0], "path": hrefRxg.exec(item)[1], "name": name});

	})

	return newArr;

}

function writeFile(file, map){

	var data = "CACHE MANIFEST\n";

	map.forEach(function(item){
		data += item + "\n";
	})

	data += "NETWORK:\n*\n"

	fs.writeFileSync(filename, data);
}


module.exports =  readHTMLFile;
