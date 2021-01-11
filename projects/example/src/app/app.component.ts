import { Component, OnInit } from '@angular/core';
import { DrawProps, ImageProps, LineProps, RectProps, TextProps } from 'ngx-canvas';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  options: DrawProps;
  dataUrl: string;

  ngOnInit(): void {
    const imgs: ImageProps[] = [
      {
        type: 'image',
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
        type: 'text',
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
        type: 'line',
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
        type: 'rect',
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
    this.options = {
      width: 375,
      height: 667,
      debug: true,
      views: [
        ...imgs,
        ...txts,
        ...lines,
        ...rects
      ]
    };
  }

  // Gets an data that is notified when the canvas is finished draw.
  drawComplete(dataUrl: string): void {
    console.log(dataUrl);
    this.dataUrl = dataUrl;
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
