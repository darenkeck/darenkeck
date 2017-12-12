import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  helpVisible = false;

  constructor() { }

  ngOnInit() {
  }

  showHelp() {
    this.helpVisible = true;
  }

  hideHelp() {
    this.helpVisible = false;
  }

}
