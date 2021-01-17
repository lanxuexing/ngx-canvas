/**
 * 绘制画布数据
 */
export interface DrawProps {
  width: number; // 生成图片宽度
  height: number; // 生成图片高度
  backgroundColor?: string; // 背景颜色，默认：#ffffff
  debug?: boolean; // 是否开启调试模式, 默认：false
  views: Array<any>; // 绘制核心数据,
  extra?: any; // 外部传入的一些额外属性，原封不动的回传回去
}

/**
 * 绘制图片数据对象
 */
export interface ImageProps {
  type: string; // 类型
  url: string; // 图片地址 支持远程图片 & 本地图片：require('./assets/x.png')
  top: number; // 图片距离顶部距离
  left: number; // 图片距离左边距离
  width: number; // 图片宽度
  height: number; // 图片高度
  borderRadius?: number; // 图片圆角
  borderWidth?: number; // 图片边框
  borderColor?: string; // 图片边框颜色
}

/**
 * 绘制文本数据对象
 */
export interface TextProps {
  type: string; // 类型
  top: number; // 文字距离顶部距离
  left: number; // 文字距离左边距离
  content: string; // 文字内容
  fontSize?: number; // 文字字号, 单位：px
  color?: string; // 文字颜色
  baseLine?: 'top' | 'middle' | 'bottom'; // 文字基线对齐
  textAlign?: 'left' | 'center' | 'right'; // 文字对齐
  opacity?: number; // 透明度
  width?: number; // 文字最大长度
  lineNum?: number; // 文字最大折行数
  lineHeight?: number; // 文字行高
  fontWeight?: number | string; // 文字加粗
  fontStyle?: string; // 文字样式
  fontFamily?: string; // 文字字体
}

/**
 * 绘制线段数据对象
 */
export interface LineProps {
  type: string; // 类型
  startX: number; // 开始坐标X
  startY: number; // 开始坐标Y
  endX: number; // 结束坐标X
  endY: number; // 结束坐标Y
  color?: string; // 线颜色
  width?: number; // 线粗细
  lineCap?: 'butt' | 'round' | 'square'; // 设置结束端点样式
}

/**
 * 绘制矩形数据对象
 */
export interface RectProps {
  type: string; // 类型
  width: number; // 矩形宽度
  height: number; // 矩形高度
  x: number; // 开始坐标X
  y: number; // 开始坐标Y
  text?: TextProps; // 文字对象
  paddingLeft?: number; // 左内边距
  paddingRight?: number; // 右内边距
  borderWidth?: number; // 边框宽度
  backgroundColor?: string; // 背景颜色
  borderColor?: string; // 边框颜色
  borderRadius?: number; // 圆角
  opacity?: number; // 透明度
}

/**
 * 画布绘制完成传播数据
 */
export interface PropagateProps {
  canvas: HTMLCanvasElement; // 画布实例对象
  ctx: CanvasRenderingContext2D; // 当前画布的2D画笔对象
  dataUrl: string; // 当前画布的内容的一张图像
  extra?: any; // 外部传入的一些额外属性，原封不动的回传回去
}
