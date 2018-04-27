// 引入模块
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var path = require('path');
var config = require('./config');

var type = 'galaxy' // 背景图：type.conf.js
var option = {}
// 请求地址
var baseUrl = page => 'https://unsplash.com/napi/collections/' + config.type[type].id + '/photos?page=' + config.pageNo + '&per_page=' + config.pageNum + '&order_by=latest&share_key=23b698712ee828a1f536ea6cab2a7396'

// 创建文件夹
if (!fs.existsSync(config.folderName)) {
  fs.mkdirSync(config.folderName)
}

// 下载图片
function download(uri, filename, callback) {
  var stream = fs.createWriteStream(path.join(__dirname + '/' + config.folderName, filename))
  request(uri).pipe(stream).on('close', callback)
}

// 下载开始
console.log('开始爬取:' + type + '背景图片')
for (let i = 1; i < config.pageNo; i++) {
  option = {
    url: baseUrl(i),
    method: 'GET',
    headers: Object.assign({}, config.header, {
      'referer': 'https://unsplash.com/wallpaper/' + config.type[type].id + '/' + config.type[type].label + '-wallpapers',
    })
  }
  let time = Math.random() * 1000
  setTimeout(() => {
    console.log('请求地址：' + baseUrl(i))
    request(option, function (err, result) {
      if (err) return err
      let data = JSON.parse(result.body)
      for (let m = 0; m < data.length; m ++) {
        let downTime = Math.random() * 2000
        let downloadUrl = data[m].links.download + '?force=true'
        setTimeout(() => {
          console.log('开始下载: ' + config.fileBaseName + data[m].likes + '-' + i + '.jpg')
          download(downloadUrl, 'mac-b-hot-' + data[m].likes + '.jpg', function () {
            console.log('下载完毕: ' + config.fileBaseName + data[m].likes + '-' + i + '.jpg')
          })
        }, downTime);
      }
    })
  }, time);
}