const PDFJS = require("pdfjs-dist/legacy/build/pdf");
const pdfjsWorker = require("pdfjs-dist/legacy/build/pdf.worker.entry");
PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * 文件转化器接口
 */
interface Iconverter {
  parse(file: File): Promise<File>;
}

class pdf2img implements Iconverter {
  private sourceFile: File;
  private targeFile: File;
  private currentPage: number = 1;
  private targeCanvasArray: any = [];
  constructor(file: File) {
    this.sourceFile = file;
  }

  private readFile() {
    const p = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = function (e) {
        resolve(e.target.result);
      };
      fileReader.readAsArrayBuffer(this.sourceFile);
    });
    return p;
  }

  private clean() {
    this.targeCanvasArray = [];
    this.currentPage = 1;
  }

  public parse(file?: File) {
    if (file) {
      this.sourceFile = file;
    }
    const p = new Promise<File>((resolve, reject) => {
      this.readFile().then(async (result) => {
        const pdf = await this.readPdf(result);
        const convasArray = await this.getImages(pdf);
        const mergedImage = this.mergeCanvas(convasArray);
        mergedImage.toBlob((blobObj) => {
          this.clean();
          resolve(new File([blobObj], file?.name, { type: "png" }));
        });
      });
    });

    return p;
  }

  private async readPdf(result: any) {
    const uint8array = new Uint8Array(result);
    const pdf = await PDFJS.getDocument({
      data: uint8array,
      // cMapUrl: null,
      // useWorkerFetch: false,
    }).promise;
    return pdf;
  }

  private async getImages(pdf: any) {
    const page = await pdf.getPage(this.currentPage);
    // 设置展示比例
    const scale = 1;
    // Set dimensions to Canvas
    var resolution = 2; // 决定pdf清晰度
    const viewport = page.getViewport(scale);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const renderContext = {
      canvasContext: ctx,
      viewport,
      transform: [resolution, 0, 0, resolution, 0, 0],
    };

    canvas.height = Math.floor(resolution * viewport.height);
    canvas.width = Math.floor(resolution * viewport.width);
    canvas.style.width = Math.floor(viewport.width) + 'px';
    canvas.style.height = Math.floor(viewport.height) + 'px';
    
    await page.render(renderContext).promise;
    this.targeCanvasArray.push(canvas);
    if (this.currentPage < pdf.numPages) {
      this.currentPage++;
      await this.getImages(pdf);
    }
    return this.targeCanvasArray;
  }

  private mergeCanvas(canvasArray: any) {
    const canvasResult = document.createElement("canvas");
    const ctx = canvasResult.getContext("2d");
    const getDy = (index: number) => {
      let dy = 0;
      if (index === 0) return dy;
      for (let i = 0; i < index; i++) {
        dy += canvasArray[i].height;
      }
      return dy;
    };

    const getHeight = () => {
      let height = 0;
      canvasArray.forEach((c: any) => {
        height += c.height;
      });
      return height;
    };

    const getWith = () => {
      let width = 0;
      canvasArray.forEach((c: any) => {
        if (c.width > width) {
          width = c.width;
        }
      });
      return width;
    };
    canvasResult.height = getHeight();
    canvasResult.width = getWith();
    canvasArray.forEach((c: any, index: number) => {
      ctx.drawImage(c, 0, getDy(index), c.width, c.height);
    });
    return canvasResult;
  }
}
export default pdf2img;
