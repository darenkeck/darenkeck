import { Component, OnInit } from '@angular/core';

import { JumbleService } from 'app/services/jumble.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  showHelp = false;
  helpVisible = false;
  constructor(private jumbleService: JumbleService,) { }

  ngOnInit() { }

  hideHelp() {
    this.helpVisible = false;
  }

  newJumble() {
    this.jumbleService.setRandomJumble();
  }

  onShowHelp(show: boolean) {
    this.showHelp = show;
  }
}
