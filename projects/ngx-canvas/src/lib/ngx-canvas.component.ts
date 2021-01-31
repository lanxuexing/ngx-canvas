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
  drawRadiusRect(x: number, y: number, w: number, h: number, r: number, borderWidth?: number, borderColor?: string): void {
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
  }

  /**
   * @description 绘制文字
   * @links https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/fillText
   * @param data 数据对象
   */
  drawText(data: TextProps): void {
    const {
      top = 0, left = 0, fontSize = 16, color = '#000', baseLine = 'top', textAlign = 'left', content, opacity = 1,
      width, lineNum = 1, lineHeight = 0, fontWeight = 'normal', fontStyle = 'normal', fontFamily = 'Microsoft YaHei'
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
    if (textWidth > width) {
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
      this.ctx.fillText(item, left, top + (lineHeight || fontSize) * index);
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
      if (borderRadius > 0) {
        // 画圆角矩形
        this.drawRadiusRect(x, y, blockWidth, height, borderRadius);
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
        this.drawRadiusRect(x, y, blockWidth, height, borderRadius);
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
   * @param circleX 圆心x轴坐标，距离画布左边的距离
   * @param circleY 圆心x轴坐标，距离画布顶部的距离
   * @param circleRadius 圆的半径
   * @param circleLineWidth 圆的画笔宽度
   * @param circleStyle 圆的样式：dashed 空心  solid 实心
   * @param circleColor 圆的画笔颜色
   * @param lineWidth 线段的宽度
   * @param lineHeight 线段的高度
   * @param lineColor 线段的画笔颜色
   * @param lineDash 线段的样式
   * @param lineCount 线段的数量
   * @param direction 方向
   */
  drawSteps(data: StepsProps): void {
    const {
      circleX, circleY, circleRadius = 5, circleLineWidth = 1, circleStyle = 'dashed', circleColor = '#000',
      lineWidth = 1, lineHeight, lineColor = '#000', lineStyle = 'solid', lineDash = [2, 2], lineCount = 1,
      direction = 'ttb'
    } = data;
    this.ctx.save();
    // steps1: 绘制小圆点
    this.ctx.lineWidth = circleLineWidth;
    if (circleStyle === 'dashed') {
      this.ctx.strokeStyle = circleColor;
    } else if (circleStyle === 'solid') {
      this.ctx.fillStyle = circleColor;
    }
    if (direction === 'ttb') { // 从上到下
      for (let n = 0; n <= lineCount; n++) {
        this.ctx.beginPath();
        this.ctx.arc(
          circleX,
          n * (2 * circleRadius) + n * lineHeight + circleRadius + circleY,
          circleRadius,
          0,
          Math.PI * 2,
          false
        );
        if (circleStyle === 'dashed') {
          this.ctx.stroke(); // 空心
        } else if (circleStyle === 'solid') {
          this.ctx.fill(); // 实心
        }
        this.ctx.closePath();
      }
    } else if (direction === 'ltr') { // 从左到右
      for (let n = 0; n <= lineCount; n++) {
        this.ctx.beginPath();
        this.ctx.arc(
          n * (2 * circleRadius) + n * lineHeight + circleRadius + circleX,
          circleY,
          circleRadius,
          0,
          Math.PI * 2,
          false
        );
        if (circleStyle === 'dashed') {
          this.ctx.stroke(); // 空心
        } else if (circleStyle === 'solid') {
          this.ctx.fill(); // 实心
        }
        this.ctx.closePath();
      }
    }
    // steps2: 绘制线段
    this.ctx.strokeStyle = lineColor;
    this.ctx.lineWidth = lineWidth;
    if (lineStyle === 'solid') {
      this.ctx.setLineDash([]); // 实线
    } else if (lineStyle === 'dashed') {
      this.ctx.setLineDash(lineDash); // 虚线
    }
    if (direction === 'ttb') { // 从上到下
      for (let n = 0; n < lineCount; n++) {
        this.ctx.beginPath();
        this.ctx.moveTo(circleX, (n + 1) * (2 * circleRadius) + n * lineHeight + circleY);
        this.ctx.lineTo(circleX, (n + 1) * (2 * circleRadius) + (n + 1) * lineHeight + circleY);
        this.ctx.stroke();
      }
      this.ctx.closePath();
    }else if (direction === 'ltr') { // 从左到右
      for (let n = 0; n < lineCount; n++) {
        this.ctx.beginPath();
        this.ctx.moveTo((n + 1) * (2 * circleRadius) + n * lineHeight + circleX, circleY);
        this.ctx.lineTo((n + 1) * (2 * circleRadius) + (n + 1) * lineHeight + circleX, circleY);
        this.ctx.stroke();
      }
      this.ctx.closePath();
    }
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
