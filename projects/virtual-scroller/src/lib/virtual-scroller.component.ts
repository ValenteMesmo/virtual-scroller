import { Component, Input, ContentChild, TemplateRef } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'virtual-scroller',
  templateUrl: './virtual-scroller.component.html',
  styles: []
})
export class VirtualScrollerComponent {

  // tslint:disable-next-line: variable-name
  _items: any[];

  get items(): any[] {
    return this._items;
  }

  @Input('items')
  set items(value: any[]) {
    this._items = value;
    this.itensUpdated();
  }

  @ContentChild(TemplateRef, { static: false })
  itemTemplate: TemplateRef<any>;

  itensUpdated() {
  }
}
