const sharp = require('sharp');
const fs = require('fs');

// 读取 SVG 文件
const svgBuffer = fs.readFileSync('icon.svg');

// 转换为 PNG
sharp(svgBuffer)
    .resize(128, 128) // 设置大小为 128x128
    .png() // 转换为 PNG
    .toFile('icon.png')
    .then(info => { console.log('转换成功:', info); })
    .catch(err => { console.error('转换失败:', err); }); 