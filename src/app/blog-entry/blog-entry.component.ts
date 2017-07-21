import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog-entry',
  templateUrl: './blog-entry.component.html',
  styleUrls: ['./blog-entry.component.css']
})
export class BlogEntryComponent implements OnInit {
  @Input() entry: any;
  constructor() { }

  ngOnInit() { }
}
