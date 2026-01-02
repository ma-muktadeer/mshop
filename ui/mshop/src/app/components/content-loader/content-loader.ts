import { Component, Input } from '@angular/core';

@Component({
  selector: 'ithouse-content-loader',
  imports: [],
  templateUrl: './content-loader.html',
  styleUrl: './content-loader.scss',
})
export class ContentLoader {
  @Input() width: string = "100%";
  @Input() height: string = "100px";
}
