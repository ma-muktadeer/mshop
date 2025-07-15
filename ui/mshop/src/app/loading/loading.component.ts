import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  ngOnInit() {
    // setTimeout(function () {
    //   document.body.classList.add('loaded');
    // }, 5000);
  }
}
