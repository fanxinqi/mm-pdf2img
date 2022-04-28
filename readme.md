# 功能
在浏览器中，把pdf文件转成img文件
[] 支持转化成长图
[] 无水印

# 使用
````javascript
import Pdf2Img from 'mm-pdf2img';
const pdf2Img = new Pdf2Img();

document.querySelector("#upload_pdf").onchange = function (e) {
  pdf2Img.parse(e.target.files[0]).then((file) => {
    console.log(file);
  });
};
````