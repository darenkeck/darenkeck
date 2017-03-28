import { Component, OnInit } from '@angular/core';
import { FbaseService }      from 'app/services/fbase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  entryList: any;
  
  constructor(private fbase: FbaseService) {
    this.entryList = this.fbase.fetchList('blog-entries');
  }

  ngOnInit() {
  }

}
