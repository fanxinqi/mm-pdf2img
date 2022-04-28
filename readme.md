# 为啥造轮子
**背景：由于业务需要，需要在客户端把用户选择的pdf 转成png**
1. 社区发现没有好用的pdf转图片的小而巧库，好不容易找到一个两年前的https://www.npmjs.com/package/convert-pdf-png  完全也跑不同，并且pdf每一页生成一个图片
2. 在线转的服务：https://app.xunjiepdf.com/pdf2longjpg/
限制2m文件，并且带水印，去掉这些限制就要买vip 

基于1，2；表示不服...决定造轮子
# 功能
**在浏览器运行时把pdf文件转成img文件的js**
-  支持转化成长图
-  无水印
-  支持转化成png、jpg、jpeg文件

# 使用
````javascript
import Pdf2Img from 'mm-pdf-img';
const pdf2Img = new Pdf2Img();

document.querySelector("#upload_pdf").onchange = function (e) {
  // pdf file
  const sourceFile = e.target.files[0];
  pdf2Img.parse(sourceFile).then((file) => {
   // png file
    console.log(file);
  });
};
````