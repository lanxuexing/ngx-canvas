# NgxCanvas

## Table of contents
- [Quick example](#quick-example)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)

## Quick example

```html
<ngx-canvas
  width="375"
  height="1234"
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

The `ngx-canvas` library can be loaded on demand using dynamic import. Webpack will load this library only when your animation gets rendered for the first time. Given the following code:

```ts
import { NgModule } from '@angular/core';
import { NgxCanvasModule } from 'ngx-canvas';

export function playerFactory() {
  return import(/* webpackChunkName: 'ngx-canvas' */ 'ngx-canvas');
}

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
import { DrawProps, ImageProps, TextProps, RectProps, LineProps } from 'ngx-canvas';

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
        type: 'image',
        url: 'assets/images/bg.png',
        top: 0,
        left: 0,
        width: 375,
        height: 1234
      }
    ];
    // draw text
    const txts: TextProps[] = [
      {
        type: 'text',
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
        type: 'rect',
        width: 375,
        height: 1234,
        x: 0,
        y: 280,
        backgroundColor: '#FFFFFF',
        borderRadius: 30
      }
    ];
    // draw line
    const lines: LineProps[] = [
      {
        type: 'line',
        color: '#999',
        startX: 10,
        startY: 200,
        endX: 350,
        endY: 200,
        width: 2,
        lineCap: 'round'
      }
    ];
    // draw options
    this.options = {
      width: 750,
      height: 1234,
      backgroundColor: '#7357FF',
      views: [
        ...imgs,
        ...txts,
        ...rects,
        ...lines
      ]
    };
  }

  drawComplete(dataUrl: string): void {
    console.log(dataUrl);
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

| @Input()        | Type              | Required    | Description                |
| --------------- | ----------------- | ----------- | -------------------------- |
| options         | `DrawProps`       | required    | Options of the canvas.     |
| width           | `number`          | optional    | Width of the canvas.       |
| height          | `number`          | optional    | Height of the canvas.      |


### Events

| @Output()        | Type                            | Required    | Description       |
| ---------------- | ------------------------------- | ----------- | ----------------- |
| drawComplete     | `(dataUrl: string) => unknown`  | optional    | Gets an data that is notified when the canvas is finished draw.      |
