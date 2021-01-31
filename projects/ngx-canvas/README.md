# NgxCanvas

<!-- Badges section here. -->
<p align="center">
  <a href="https://travis-ci.com/"><img src="https://travis-ci.com/lanxuexing/ngx-canvas.svg?branch=main" alt="Build Status"></a>
  <a href="https://npmcharts.com/compare/ngx-canvas?minimal=true"><img src="https://img.shields.io/npm/dm/ngx-canvas.svg?sanitize=true" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/ngx-canvas"><img src="https://img.shields.io/npm/v/ngx-canvas.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/ngx-canvas"><img src="https://img.shields.io/npm/l/ngx-canvas.svg?sanitize=true" alt="License"></a>
</p>

## Table of contents
- [Quick example](#quick-example)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Events](#events)
- [Types](#types)
- [Demo](#demo)

## Quick example

```html
<ngx-canvas
  width="375"
  height="667"
  [options]="options"
  (drawComplete)="drawComplete($event)"
></ngx-canvas>
```

## Installation

To install `ngx-canvas` run the following command:

```bash
npm i ngx-canvas --save
```

## Usage

First, import the `NgxCanvasModule` into the `AppModule`:

```typescript
import { NgModule } from '@angular/core';
import { NgxCanvasModule } from 'ngx-canvas';

@NgModule({
  imports: [
    NgxCanvasModule.forRoot()
  ]
})
export class AppModule {}
```


Now you can simply use the `ngx-canvas` component and provide your custom options via the `options` binding:

```typescript
import { Component, OnInit } from '@angular/core';
import { DrawProps, ImageProps, TextProps, PropagateProps, RectProps, LineProps, StepsProps, Types } from 'ngx-canvas';

@Component({
  selector: 'app-root',
  template: `
    <ngx-canvas [options]="options" (drawComplete)="drawComplete($event)"></ngx-canvas>
  `,
})
export class AppComponent implements OnInit {
  options: DrawProps;

  ngOnInit(): void {
    // draw image
    const imgs: ImageProps[] = [
      {
        type: Types.image,
        url: 'assets/images/bg.png',
        top: 0,
        left: 0,
        width: 375,
        height: 667
      }
    ];
    // draw text
    const txts: TextProps[] = [
      {
        type: Types.text,
        content: 'Have good time.',
        top: 100,
        left: 100,
        fontSize: 18,
        color: '#FFFFFF',
        lineHeight: 30,
        width: 200,
        lineNum: 1,
        fontFamily: 'Microsoft YaHei'
      }
    ];
    // draw rect
    const rects: RectProps[] = [
      {
        type: Types.rect,
        width: 375,
        height: 667,
        x: 0,
        y: 280,
        backgroundColor: '#FFFFFF',
        borderRadius: 30
      }
    ];
    // draw line
    const lines: LineProps[] = [
      {
        type: Types.line,
        color: '#999',
        startX: 10,
        startY: 200,
        endX: 350,
        endY: 200,
        width: 2,
        lineCap: 'round'
      }
    ];
    // draw steps
    const steps: StepsProps[] = [{
      type: Types.steps,
      circleX: 48,
      circleY: 530,
      lineHeight: 80,
      lineCount: 3,
      lineColor: '#FFF',
      circleColor: '#FFF',
      direction: 'ltr',
      circleStyle: 'solid',
      lineStyle: 'solid'
    }];
    // draw options
    this.options = {
      debug: true, // Used to debug the presentation canvas
      width: 375,
      height: 667,
      backgroundColor: '#47b785',
      views: [
        ...imgs,
        ...txts,
        ...rects,
        ...lines,
        ...steps
      ],
      extra: 'Extend the params and return after drawing.'
    };
  }

  drawComplete(propagate: PropagateProps): void {
    const { dataUrl, canvas, ctx, extra } = propagate;
    // downloading canvas element to an image
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = dataUrl;
    a.download = 'filename';
    a.click();
    a.remove();
  }
}
```

Notice that you will need to import the `NgxCanvasModule` into other modules as it exports `ngx-canvas` component. But `forRoot` has to be called only once!


## API

### Bindings

| @Input()        | Type              | Required    | Description                        |
| --------------- | ----------------- | ----------- | ---------------------------------  |
| options         | `DrawProps`       | required    | Options of the canvas.             |
| width           | `number`          | optional    | Width of the canvas display.       |
| height          | `number`          | optional    | Height of the canvas display.      |


### Events

| @Output()        | Type                            | Required    | Description       |
| ---------------- | ------------------------------- | ----------- | ----------------- |
| drawComplete     | `(propagate: PropagateProps) => unknown`  | optional    | Gets an data that is notified when the canvas is finished draw.      |


## Types

| DrawProps        | Type              | Required    | Description                        | Default    |
| ---------------- | ----------------- | ----------- | ---------------------------------  | -----------|
| width            | `number`          | required    | Generate image width.              | null       |
| height           | `number`          | required    | Generated image height.            | null       |
| backgroundColor  | `string`          | optional    | Canvas background color.           | '#FFFFFF'  |
| debug            | `boolean`         | optional    | Whether to enable debugging mode.  | false      |
| views            | `Array<T>`        | required    | Canvas drawing core data.          | null       |
| extra            | `any`             | optional    | Some extra data.                   | null       |

---

| ImageProps       | Type              | Required    | Description                                         | Default              |
| ---------------- | ----------------- | ----------- | --------------------------------------------------- | -------------------- |
| type             | `string`          | required    | Type of drawing.                                    | Fixed value 'image'  |
| url              | `string`          | required    | Picture path or remote address.                     | null                 |
| top              | `number`          | required    | Y-axis coordinate in the destination canvas.        | 0                    |
| left             | `number`          | required    | X-axis coordinate in the destination canvas.        | 0                    |
| width            | `number`          | required    | Width to draw the image in the destination canvas.  | 0                    |
| height           | `number`          | required    | Height to draw the image in the destination canvas. | 0                    |
| borderRadius     | `number`          | optional    | Image borderRadius.                                 | 0                    |
| borderWidth      | `number`          | optional    | Image borderWidth.                                  | 0                    |
| borderColor      | `string`          | optional    | Image borderColor.                                  | 'rgba(255,255,255,0)'|

---

| TextProps        | Type              | Required    | Description                                         | Default              |
| ---------------- | ----------------- | ----------- | --------------------------------------------------- | -------------------- |
| type             | `string`          | required    | Type of drawing.                                    | Fixed value 'text'   |
| top              | `number`          | required    | Y-axis coordinate in the destination canvas.        | 0                    |
| left             | `number`          | required    | X-axis coordinate in the destination canvas.        | 0                    |
| content          | `string`          | required    | Text string to render into the context.             | null                 |
| fontSize         | `number`          | optional    | Font size.                                          | 16                   |
| baseLine         | `string`          | optional    | Current text baseline used when drawing text.       | '#000'               |
| textAlign        | `string`          | optional    | Current text alignment used when drawing text.      | 'top'                |
| opacity          | `number`          | optional    | Font transparency.                                  | 'left'               |
| width            | `number`          | optional    | Maximum text width.                                 | null                 |
| lineNum          | `number`          | optional    | Maximum Text lines.                                 | 1                    |
| lineHeight       | `number`          | optional    | Font line height.                                   | 0                    |
| fontWeight       | `number`          | optional    | Font weight.                                        | 'normal'             |
| fontStyle        | `string`          | optional    | Font style.                                         | 'normal'             |
| fontFamily       | `string`          | optional    | Font family.                                        | 'Microsoft YaHei'    |

--- 

| LineProps        | Type              | Required    | Description                                         | Default              |
| ---------------- | ----------------- | ----------- | --------------------------------------------------- | -------------------- |
| type             | `string`          | required    | Type of drawing.                                    | Fixed value 'line'   |
| startX           | `number`          | required    | X-axis coordinate of the line's start point.        | null                 |
| startY           | `number`          | required    | Y-axis coordinate of the line's start point.        | null                 |
| endX             | `number`          | required    | X-axis coordinate of the line's end point.          | null                 |
| endY             | `number`          | required    | Y-axis coordinate of the line's end point.          | null                 |
| color            | `string`          | optional    | Color of the line.                                  | '#000'               |
| width            | `number`          | optional    | Width of the line.                                  | 1                    |
| lineCap          | `string`          | optional    | Shape used to draw the end points of lines.         | 'butt'               |


---

| RectProps        | Type              | Required    | Description                                         | Default              |
| ---------------- | ----------------- | ----------- | --------------------------------------------------- | -------------------- |
| type             | `string`          | required    | Type of drawing.                                    | Fixed value 'rect'   |
| width            | `number`          | required    | Rectangle's width.                                  | 0                    |
| height           | `number`          | required    | Rectangle's height.                                 | null                 |
| x                | `number`          | required    | X-axis coordinate of the rectangle's start point.   | null                 |
| y                | `number`          | required    | Y-axis coordinate of the rectangle's start point.   | null                 |
| text             | `TextProps`       | optional    | Text string to render into the context.             | null                 |
| paddingLeft      | `number`          | optional    | Padding area to the left of rectangle's.            | 0                    |
| paddingRight     | `number`          | optional    | Padding area to the right of rectangle's.           | 0                    |
| borderWidth      | `number`          | optional    | Width of rectangle's border.                        | null                 |
| backgroundColor  | `string`          | optional    | BackgroundColor of rectangle's                      | null                 |
| borderColor      | `string`          | optional    | Shape used to draw the end points of lines.         | null                 |
| borderRadius     | `number`          | optional    | Radius of rectangle's border.                       | 0                    |
| opacity          | `number`          | optional    | Rect transparency.                                  | 1                    |


---

| StepsProps       | Type              | Required    | Description                                         | Default              |
| ---------------- | ----------------- | ----------- | --------------------------------------------------- | -------------------- |
| type             | `string`          | required    | Type of drawing.                                    | Fixed value 'steps'  |
| circleX          | `number`          | required    | Horizontal coordinate of the arc's center.          | null                 |
| circleY          | `number`          | required    | Vertical coordinate of the arc's center.            | null                 |
| lineHeight       | `number`          | required    | Height number of line.                              | null                 |
| lineCount        | `number`          | required    | Total number of line.                               | 1                    |
| circleRadius     | `number`          | optional    | Text string to render into the context.             | 5                    |
| circleLineWidth  | `number`          | optional    | Sets the thickness of lines.                        | 1                    |
| circleStyle      | `string`          | optional    | Sets the line dash pattern used when stroking lines.| 'dashed'             |
| circleColor      | `string`          | optional    | Specifies the color to use for the strokes.         | '#000'               |
| lineWidth        | `string`          | optional    | Sets the thickness of lines.                        | 1                    |
| lineColor        | `string`          | optional    | Specifies the color to use for the strokes.         | '#000'               |
| lineStyle        | `string`          | optional    | Radius of rectangle's border.                       | 'solid'              |
| lineDash         | `number[]`        | optional    | Sets the line dash pattern used when stroking lines.| [2,2]                |
| direction        | `string`          | optional    | Specifies the direction of steps.                   | 'ttb'                |

---

| PropagateProps   | Type                            | Description                                         |
| ---------------- | ------------------------------- | --------------------------------------------------- |
| canvas           | `HTMLCanvasElement`             | Canvas Instance Object.                             |
| ctx              | `CanvasRenderingContext2D`      | CanvasRenderingContext2D interface Object.          |
| dataUrl          | `string`                        | Data URI containing a representation of the image.  |
| extra            | `any`                           | Additional parameters are returned after drawing.   |


## Demo

You can clone this repo to your working copy and then launch the demo page in your local machine:

```vim
npm install
npm run build:prod
npm run start
```

The demo page server is listening on: http://localhost:4200

- [online demo](lanxuexing.github.io/ngx-canvas/)