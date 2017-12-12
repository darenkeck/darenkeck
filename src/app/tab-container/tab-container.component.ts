import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab-container',
  templateUrl: './tab-container.component.html',
  styleUrls: ['./tab-container.component.scss']
})
export class TabContainerComponent implements OnInit {
  show: boolean = true;
  height        = 'auto';
  constructor() { }

  ngOnInit() {
  }

  onExpand(show) {
    this.show = show;

    // this.height = (show) ? '3em' : '0.8em';
  }

}
