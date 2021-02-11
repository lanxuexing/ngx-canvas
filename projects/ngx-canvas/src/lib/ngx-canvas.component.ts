import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  DrawProps,
  ImageProps,
  LineProps,
  ProgressProps,
  PropagateProps,
  RectProps,
  StepsProps,
  TextProps,
  Types
} from './type';

@Component({
  selector: 'ngx-canvas',
  template: `
    <canvas
      [hidden]="!options?.debug"
      [style.--width]="width"
      [style.--height]="height"
      #canvas>
      Your browser does not support the canvas tag.
    </canvas>
  `,
  styles: [`
    canvas {
      width: calc(var(--width) * 1px);
      height: calc(var(--height) * 1px);
    }
  `]
})
export class NgxCanvasComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() options: DrawProps;
  @Input() width: number;
  @Input() height: number;
  @Output() drawComplete: EventEmitter<PropagateProps> = new EventEmitter();
  @ViewChild('canvas') canvasRef: ElementRef;

  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  private timer: number;

  constructor() { }

  ngAfterViewInit(): void {
    this.initCanvas();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.options && !changes.options.firstChange) {
      this.initCanvas();
    }
  }

  /**
   * @description 初始化canvas画布
   * @links https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/canvas
   */
  private initCanvas(): void {
    this.canvas = this.canvasRef.nativeElement;
    if (!this.canvas.getContext) { return; }
    if (!this.options?.width || !this.options?.height || this.options?.views.length === 0) {
      return;
    }
    this.canvas.width = this.options.width;
    this.canvas.height = this.options.height;
    this.ctx = this.canvas.getContext('2d');
    this.drawArr();
  }


  /**
   * @description 绘图
   * @links https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D
   */
  private async drawArr(): Promise<void> {
    // setps1：绘制背景色
    if (this.options.backgroundColor) {
      this.ctx.save();
      this.ctx.fillStyle = this.options.backgroundColor;
      this.ctx.fillRect(0, 0, this.options.width, this.options.height);
      this.ctx.restore();
    }
    for (const iterator of this.options.views) {
      if (iterator.type === 'image' || iterator.type === Types.image) {
        // setps2：绘制图片
        await this.drawImg(iterator);
      } else if (iterator.type === 'text' || iterator.type === Types.text) {
        // setps3：绘制文字
        this.drawText(iterator);
      } else if (iterator.type === 'rect' || iterator.type === Types.rect) {
        // setps4：绘制矩形
        this.drawRect(iterator);
      } else if (iterator.type === 'line' || iterator.type === Types.line) {
        // steps5：绘制线段
        this.drawLine(iterator);
      } else if (iterator.type === 'steps' || iterator.type === Types.steps) {
        // steps6：绘制步骤条
        this.drawSteps(iterator);
      } else if (iterator.type === 'progress' || iterator.type === Types.progress) {
        // steps7：绘制进度条
        this.drawProgress(iterator);
      }
    }
    // steps6：绘制完成向外发射数据和事件
    const propagate: PropagateProps = {
      canvas: this.canvas,
      ctx: this.ctx,
      dataUrl: this.canvas.toDataURL(),
      extra: this.options?.extra
    };
    this.drawComplete.emit(propagate);
  }

  /**
   * @description 绘制图片
   * @links https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/drawImage
   * @param data 数据对象
   */
  drawImg(data: ImageProps): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const {
        url, top = 0, left = 0, width = 0, height = 0, borderRadius = 0, borderWidth = 0, borderColor = 'rgba(255,255,255,0)'
      } = data;
      this.ctx.save();
      const img = new Image();
      img.setAttribute('crossorigin', 'anonymous');
      img.src = url;
      img.onload = () => {
        if (borderRadius > 0) {
          this.drawRadiusRect(left, top, width, height, borderRadius, borderWidth, borderColor);
          this.ctx.clip();
          this.ctx.drawImage(img, left, top, width, height);
        } else {
          this.ctx.drawImage(img, left, top, width, height);
        }
        this.ctx.restore();
        this.timer = window.setTimeout(() => {
          resolve(true);
        }, 100);
      };
      img.onerror = (err) => {
        reject(err);
      };
    });
  }

  /**
   * @description 绘制圆角矩形
   * @links https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/arc
   * @param x 距离左边的距离
   * @param y 距离顶部的距离
   * @param w 矩形的宽
   * @param h 矩形的高
   * @param r 矩形的圆角
   * @param borderWidth 矩形边框的宽
   * @param borderColor 矩形边框的颜色
   */
  drawRadiusRect(x: number, y: number, w: number, h: number, r: number | string, borderWidth?: number, borderColor?: string): void {
    if (typeof (r) === 'number') {
      const br = r / 2;
      this.ctx.beginPath();
      if (borderWidth > 0) { this.ctx.lineWidth = borderWidth; }
      this.ctx.strokeStyle = borderColor;
      this.ctx.moveTo(x + br, y); // 移动到左上角的点
      this.ctx.lineTo(x + w - br, y);
      this.ctx.arc(x + w - br, y + br, br, 2 * Math.PI * (3 / 4), 2 * Math.PI * (4 / 4));
      this.ctx.lineTo(x + w, y + h - br);
      this.ctx.arc(x + w - br, y + h - br, br, 0, 2 * Math.PI * (1 / 4));
      this.ctx.lineTo(x + br, y + h);
      this.ctx.arc(x + br, y + h - br, br, 2 * Math.PI * (1 / 4), 2 * Math.PI * (2 / 4));
      this.ctx.lineTo(x, y + br);
      this.ctx.arc(x + br, y + br, br, 2 * Math.PI * (2 / 4), 2 * Math.PI * (3 / 4));
      this.ctx.closePath();
      this.ctx.stroke();
    } else if (typeof (r) === 'string') {
      const temp = r.split(' ').map(Number);
      let br = [];
      if (temp.length === 1) {
        // tslint:disable-next-line:no-shadowed-variable
        br = [r, r, r, r].map(Number).map(x => x / 2);
      } else if (temp.length === 2) {
        // tslint:disable-next-line:no-shadowed-variable
        br = [temp[1], temp[0], temp[1], temp[0]].map(Number).map(x => x / 2);
      } else if (temp.length === 3) {
        // tslint:disable-next-line:no-shadowed-variable
        br = [temp[1], temp[0], temp[2], temp[0]].map(Number).map(x => x / 2);
      } else if (temp.length === 4) {
        // tslint:disable-next-line:no-shadowed-variable
        br = [temp[1], temp[2], temp[3], temp[0]].map(Number).map(x => x / 2);
      }
      this.ctx.beginPath();
      if (borderWidth > 0) { this.ctx.lineWidth = borderWidth; }
      this.ctx.strokeStyle = borderColor;
      this.ctx.moveTo(x + br[0], y); // 移动到左上角的点
      this.ctx.lineTo(x + w - br[0], y);
      this.ctx.arc(x + w - br[0], y + br[0], br[0], 2 * Math.PI * (3 / 4), 2 * Math.PI * (4 / 4));
      this.ctx.lineTo(x + w, y + h - br[1]);
      this.ctx.arc(x + w - br[1], y + h - br[1], br[1], 0, 2 * Math.PI * (1 / 4));
      this.ctx.lineTo(x + br[2], y + h);
      this.ctx.arc(x + br[2], y + h - br[2], br[2], 2 * Math.PI * (1 / 4), 2 * Math.PI * (2 / 4));
      this.ctx.lineTo(x, y + br[3]);
      this.ctx.arc(x + br[3], y + br[3], br[3], 2 * Math.PI * (2 / 4), 2 * Math.PI * (3 / 4));
      this.ctx.closePath();
      this.ctx.stroke();
    }
  }

  /**
   * @description 绘制文字
   * @links https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/fillText
   * @param data 数据对象
   */
  drawText(data: TextProps): void {
    const {
      top = 0, left = 0, fontSize = 16, color = '#000', baseLine = 'top', textAlign = 'left', content, opacity = 1,
      width, lineNum = 1, lineHeight = 0, fontWeight = 'normal', fontStyle = 'normal', fontFamily = 'Microsoft YaHei',
      indentWidth = 0
    } = data;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
    this.ctx.globalAlpha = opacity;
    this.ctx.textAlign = textAlign;
    this.ctx.textBaseline = baseLine;
    this.ctx.fillStyle = color;
    let textWidth = this.ctx.measureText(content).width;
    const textArr = [];
    if (textWidth > (indentWidth > 0 ? width - indentWidth : width)) { // 首行缩进最大宽度校验
      let fillText = '';
      let line = 1;
      for (let i = 0; i <= content.length - 1; i += 1) { // 将文字转为数组
        fillText += content[i];
        if (this.ctx.measureText(fillText).width >= width) {
          if (line === lineNum) {
            if (i !== content.length - 1) {
              fillText = `${fillText.substring(0, fillText.length - 1)}...`;
            }
          }
          if (line <= lineNum) {
            textArr.push(fillText);
          }
          fillText = '';
          line += 1;
        } else if (line <= lineNum) {
          if (i === content.length - 1) {
            textArr.push(fillText);
          }
        }
      }
      textWidth = width;
    } else {
      textArr.push(content);
    }
    textArr.forEach((item, index) => {
      if (indentWidth && index === 0) { // 首行缩进
        this.ctx.fillText(item, left + indentWidth, top + (lineHeight || fontSize) * index);
      } else {
        this.ctx.fillText(item, left, top + (lineHeight || fontSize) * index);
      }
    });
    this.ctx.restore();
  }

  /**
   * @description 绘制线段
   * @links https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineTo
   * @param data 数据对象
   */
  drawLine(data: LineProps): void {
    const {
      startX, startY, endX, endY, color = '#000', width = 1, lineCap = 'butt',
    } = data;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.lineCap = lineCap;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, endY);
    this.ctx.stroke(); // 进行绘制
    this.ctx.closePath();
    this.ctx.restore();
  }

  /**
   * @description 绘制矩形
   * @links https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/fillRect
   * @param data 数据对象
   */
  drawRect(data: RectProps): void {
    const {
      text, width = 0, height, x, y, paddingLeft = 0, paddingRight = 0, borderWidth,
      backgroundColor, borderColor, borderRadius = 0, opacity = 1
    } = data;
    // 判断是否块内有文字
    let blockWidth = 0; // 块的宽度
    let textX = 0;
    let textY = 0;
    if (typeof text !== 'undefined') {
      // 如果有文字并且块的宽度小于文字宽度，块的宽度为 文字的宽度 + 内边距
      const textWidth = this.getTextWidth(typeof text.content === 'string' ? text : text.content);
      blockWidth = textWidth > width ? textWidth : width;
      blockWidth += paddingLeft + paddingLeft;
      const { textAlign = 'left' } = text;
      textY = height / 2 + y; // 文字的y轴坐标在块中线
      if (textAlign === 'left') {
        // 如果是右对齐，那x轴在块的最左边
        textX = x + paddingLeft;
      } else if (textAlign === 'center') {
        textX = blockWidth / 2 + x;
      } else {
        textX = x + blockWidth - paddingRight;
      }
    } else {
      blockWidth = width;
    }
    if (backgroundColor) {
      // 画面
      this.ctx.save();
      this.ctx.globalAlpha = opacity;
      this.ctx.fillStyle = backgroundColor;
      if (borderRadius > 0 || (borderRadius && borderRadius !== 0)) {
        // 画圆角矩形
        this.drawRadiusRect(x, y, blockWidth, height, borderRadius, borderWidth, borderColor);
        this.ctx.fill();
      } else {
        this.ctx.fillRect(x, y, blockWidth, height);
      }
      this.ctx.restore();
    }
    if (borderWidth) {
      // 画线
      this.ctx.save();
      this.ctx.globalAlpha = opacity;
      this.ctx.fillStyle = borderColor;
      this.ctx.lineWidth = borderWidth;
      if (borderRadius > 0) {
        // 画圆角矩形边框
        this.drawRadiusRect(x, y, blockWidth, height, borderRadius, borderWidth, borderColor);
        this.ctx.stroke();
      } else {
        this.ctx.strokeRect(x, y, blockWidth, height);
      }
      this.ctx.restore();
    }
    if (text) {
      this.drawText(Object.assign(text, { x: textX, y: textY }));
    }
  }

  /**
   * @description 绘制步骤条
   * @links https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/arc
   * @param data 步骤条数据对象
   * @param speed 叠加因子
   */
  drawSteps(data: StepsProps): void {
    const {
      left = 0, top = 0, r = 5, startAngle = 0, endAngle = Math.PI * 2,
      strokeColor = '#CCCCCC', mode = 'fill', lineWidth = 1,
      unfinishedColor = '#FF8478', processColor = '#3DA8F5', finishedColor = '#9ED979',
      cableColor = '#EBEBEB', direction = 'column', lists = []
    } = data;
    if (lists.length === 0) { return; }
    let speed = direction === 'column' ? top : left;
    const spacing = lists[0].spacing || 50;
    // 循环遍历绘制图像
    for (let i = 0; i < lists.length; i++) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.strokeStyle = strokeColor;
      this.ctx.lineWidth = lineWidth;
      // 绘制圆
      if (direction === 'column') {
        this.ctx.arc(left, speed, r, startAngle, endAngle);
      } else if (direction === 'row') {
        this.ctx.arc(speed, top, r, startAngle, endAngle);
      }
      if (mode === 'none') {
        this.ctx.stroke();
      } else {
        // 根据状态填充颜色
        switch (lists[i].status) {
          case 0: // 未完成
            mode === 'fill' ? this.ctx.fillStyle = unfinishedColor : this.ctx.strokeStyle = unfinishedColor;
            break;
          case 1: // 进行中
            mode === 'fill' ? this.ctx.fillStyle = processColor : this.ctx.strokeStyle = processColor;
            break;
          case 2: // 已完成
            mode === 'fill' ? this.ctx.fillStyle = finishedColor : this.ctx.strokeStyle = finishedColor;
            break;
        }
        mode === 'fill' ? this.ctx.fill() : this.ctx.stroke();
      }
      this.ctx.closePath();
      // 绘制圆之间的连线
      this.ctx.beginPath();
      this.ctx.strokeStyle = cableColor;
      // 画圆之间的连线
      if (i !== lists.length - 1) {
        if (direction === 'column') {
          this.ctx.moveTo(left, speed + r); // 起始位置
          this.ctx.lineTo(left, speed + spacing - r); // 停止位置
        } else if (direction === 'row') {
          this.ctx.moveTo(speed + r, top); // 起始位置
          this.ctx.lineTo(speed + spacing - r, top); // 停止位置
        }
      }
      this.ctx.stroke();
      this.ctx.closePath();
      if (direction === 'column') {
        speed += lists[i].spacing ? lists[i].spacing : spacing;
      } else if (direction === 'row') {
        speed += lists[i].spacing ? lists[i].spacing : spacing;
      }
      this.ctx.restore();
    }
  }

  /**
   * @description 绘制进度条
   * @linkshttps://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineTo
   * @param data 进度条数据对象
   */
  drawProgress(data: ProgressProps): void {
    const {
      startX = 0, startY = 0, endX = 0, endY = 0, lineWidth = 12, linecap = 'round', percent = 0, fromColor = '#ccc', toColor = '#46b684',
      fontLineWidth = 1, fontColor = '#4a4a4a', fontSize = 16, fontWeight = 'normal', fontStyle = 'normal', fontFamily = 'Microsoft YaHei',
      info = '', infoMarginLeft = 10
    } = data;
    this.ctx.save();
    // 首先绘制背景
    this.ctx.beginPath();
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = fromColor;
    this.ctx.lineCap = linecap;
    this.ctx.lineTo(startX, startY);
    this.ctx.lineTo(endX, endY);
    this.ctx.stroke();
    this.ctx.closePath();
    // 然后绘制进度
    if (percent > 0) {
      this.ctx.beginPath();
      this.ctx.lineWidth = lineWidth; // 设置线宽
      this.ctx.strokeStyle = toColor; // 画笔颜色
      this.ctx.lineTo(startX, startY);
      this.ctx.lineTo(startX + percent, endY);
      this.ctx.stroke();
      this.ctx.closePath();
    }
    // 最后绘制变动的数字
    this.ctx.beginPath();
    this.ctx.lineWidth = fontLineWidth;
    this.ctx.fillStyle = fontColor;
    this.ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
    // tslint:disable-next-line:radix
    this.ctx.fillText(info ? info : parseInt(String(percent / (endX - startX))) + '%', endX + infoMarginLeft, endY + lineWidth);
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.restore();
  }

  /**
   * @description 动态计算文本长度
   * @param draweText 数组 | 对象
   */
  private getTextWidth(draweText: Array<any> | object): number {
    let texts = [];
    if (Object.prototype.toString.call(draweText) === '[object Object]') {
      texts.push(draweText);
    } else {
      texts = draweText as any[];
    }
    let width = 0;
    texts.forEach(({ fontSize, text, marginLeft = 0, marginRight = 0 }) => {
      this.ctx.font = `${fontSize}`;
      width += this.ctx.measureText(text).width + marginLeft + marginRight;
    });
    return width;
  }

  ngOnDestroy(): void {
    if (this.timer) { clearTimeout(this.timer); }
  }

}
