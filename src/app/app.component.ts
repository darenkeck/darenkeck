import { Component } from '@angular/core';
import { Http }      from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { FbaseService } from 'app/services/fbase.service';
import { JumbleService } from './services/jumble.service';

// enum to help track current tab
export const TabPage = {
  HOME: 'Home',
  MUSIC: 'Music',
  BIO: 'Bio'
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  entryList: Observable<string[]>;
  title = 'Daren Keck';
  tab = TabPage.HOME;

  constructor(private fbase: FbaseService, private jumbleService: JumbleService) {
    this.entryList = this.fbase.fetchList('blog-entries');
  }

  newJumble() {
    this.jumbleService.setJumble();
  }
}
