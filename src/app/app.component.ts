import { Component } from '@angular/core';
import { Http }      from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { FbaseService } from 'app/services/fbase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  entryList: Observable<string[]>;
  title = 'Daren Keck';

  constructor(private fbase: FbaseService) {
    this.entryList = this.fbase.fetchList('blog-entries');
  }
}
