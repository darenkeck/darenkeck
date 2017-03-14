import { Component } from '@angular/core';
import { Http }      from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Daren Keck';
  dummyText1 = '';
  dummyText2 = '';

  constructor(private http: Http) {
    this.getDoggeText(1)
        .subscribe(text => this.dummyText1 = text);

    this.getDoggeText(2)
        .subscribe(text => this.dummyText2 = text);
  }

  getDoggeText(paragraphs: number) {
    let obs = this.http.get(`https://www.dogeipsum.com/api/?type=so-doge&start-with-lorem=1&paras=${paragraphs}`)
             .map(resp => {
                if (resp && Array.isArray(resp.json())) {
                  return resp.json()[0];
                } else {
                  return '';
                }
              });

    return obs;
  }
}
