import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sandbox';
  things = [
    { id: 1, text: 'aaa' }
    , { id: 2, text: 'bbb' }
    , { id: 3, text: 'ccc' }
    , { id: 4, text: 'ddd' }
  ];
}
