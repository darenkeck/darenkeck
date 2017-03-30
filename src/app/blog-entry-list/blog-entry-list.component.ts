import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog-entry-list',
  templateUrl: './blog-entry-list.component.html',
  styleUrls: ['./blog-entry-list.component.css']
})
export class BlogEntryListComponent implements OnInit {
  @Input() entryList: any;
  constructor() { }

  ngOnInit() {
  }

}
