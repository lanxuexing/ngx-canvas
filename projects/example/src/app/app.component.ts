import { Component, OnInit, ViewChild } from '@angular/core';
import {
  DrawProps,
  ImageProps,
  LineProps,
  NgxCanvasComponent,
  PropagateProps,
  RectProps,
  TextProps,
  StepsProps,
  Types,
  ProgressProps
} from 'ngx-canvas';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  options: DrawProps; // config opts
  dataUrl: string;

  @ViewChild('ngxCanvas') ngxCanvas: NgxCanvasComponent;

  ngOnInit(): void {
    const imgs: ImageProps[] = [
      {
        type: Types.image,
        url: 'assets/bg.jpg',
        width: 375,
        height: 667,
        top: 0,
        left: 0
      },
      {
        type: 'image',
        url: 'https://avatars0.githubusercontent.com/u/20652750?s=460&u=f551621c2f65663d6177cb3a7575c8e9eb1b0e47&v=4',
        width: 120,
        height: 120,
        top: 130,
        left: 140,
        borderRadius: 120
      }
    ];
    const txts: TextProps[] = [
      {
        type: 'text',
        top: 290,
        left: 90,
        content: 'A Day In Code',
        fontSize: 32,
        color: '#FFF',
      },
      {
        type: Types.text,
        top: 340,
        left: 130,
        content: '01001',
        fontSize: 48,
        fontWeight: '800',
        color: '#FFF'
      }
    ];
    const lines: LineProps[] = [
      {
        type: Types.line,
        startX: 160,
        startY: 430,
        endX: 230,
        endY: 430,
        color: '#FFF',
        lineCap: 'round'
      }
    ];
    const rects: RectProps[] = [
      {
        type: Types.rect,
        width: 20,
        height: 20,
        x: 186,
        y: 490,
        text: {
          type: 'text',
          top: 480,
          left: 180,
          content: '🎉',
          fontSize: 24,
          fontWeight: '800',
          color: '#FFF'
        }
      }
    ];
    const steps: StepsProps[] = [
      {
        type: Types.steps,
        left: 140,
        top: 530,
        direction: 'row',
        lists: [
          { status: 2, spacing: 50 },
          { status: 1, spacing: 50 },
          { status: 0, spacing: 50 }
        ]
      }
    ];
    const progress: ProgressProps[] = [
      {
        type: Types.progress,
        startX: 140,
        startY: 560,
        endX: 240,
        endY: 560,
        percent: 60
      }
    ];
    this.options = {
      width: 375,
      height: 667,
      debug: true,
      views: [
        ...imgs,
        ...txts,
        ...lines,
        ...rects,
        ...steps,
        ...progress
      ],
      extra: 'Extend the params and return after drawing.'
    };
  }

  // Gets an data that is notified when the canvas is finished draw.
  drawComplete(propagate: PropagateProps): void {
    const { dataUrl, canvas, ctx, extra } = propagate;
    this.dataUrl = dataUrl;
    console.log('draw complete', propagate);
    console.log('ngx-canvas comps', this.ngxCanvas);
  }

  // downloading canvas element to an image
  download(): void {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = this.dataUrl;
    a.download = 'filename';
    a.click();
    a.remove();
  }

}
