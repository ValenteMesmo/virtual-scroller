import { Component, Input, ContentChild, TemplateRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'virtual-scroller',
  templateUrl: './virtual-scroller.component.html',
  styles: []
})
export class VirtualScrollerComponent implements AfterViewInit, OnDestroy {
  // tslint:disable-next-line: variable-name
  _items: any[];
  emptySizeBefore = 0;
  emptySizeAfter = 0;

  get items(): any[] {
    return this._items;
  }

  @Input('items')
  set items(value: any[]) {
    this._items = value;
    this.onScroll();
  }

  @ContentChild(TemplateRef, { static: false })
  itemTemplate: TemplateRef<any>;

  @ViewChild('scroll', { static: false })
  scroll;

  visibleItems: any[] = [];

  previousFirstIndex = -1;
  previousLastIndex = -1;
  private onScroll() {

    if (!this.scroll) {
      return;
    }

    const pageSize = 5;
    const magicNumber = 10;
    const scrollTop = this.scroll.nativeElement.scrollTop;
    const docHeight = this.items.length * magicNumber * pageSize;
    const scollIndex = Math.floor(((this.items.length * scrollTop) / docHeight));

    const pageHalf = Math.floor(pageSize / 2);
    let firstIndex = scollIndex - pageHalf;
    let lastIndex = scollIndex + pageHalf;

    if (firstIndex < 0) {
      firstIndex = 0;
      lastIndex += pageHalf;
    }

    if (lastIndex > this.items.length - 1) {
      lastIndex = this.items.length - 1;
      firstIndex -= pageHalf;
      if (firstIndex < 0) {
        firstIndex = 0;
      }
    }

    if (this.previousFirstIndex === firstIndex && this.previousLastIndex === lastIndex) {
      return;
    }
    this.previousFirstIndex = firstIndex;
    this.previousLastIndex = lastIndex;
    console.log(firstIndex, lastIndex);
    this.visibleItems = this.items.slice(firstIndex, lastIndex);

    setTimeout(() => {
      let additionalSize = 0;
      for (const i in this.scroll.nativeElement.childNodes) {
        if (this.scroll.nativeElement.childNodes[i]) {
          const element = this.scroll.nativeElement.childNodes[i];
          if (element && element.classList && !element.classList.contains('ignore')) {

            additionalSize += element.clientHeight;
          }
        }
      }

      this.emptySizeBefore = (scollIndex * magicNumber * pageSize) + magicNumber * pageSize; // scrollTop + additionalSize;
      if (this.emptySizeBefore < 0) {
        this.emptySizeBefore = 0;
      }
      this.emptySizeAfter = docHeight - this.emptySizeBefore;
    }, 1);

  }

  ngAfterViewInit() {
    this.scroll.nativeElement.addEventListener('scroll', () => this.onScroll());
    setTimeout(() => {
      this.onScroll();
    }, 1);
  }

  ngOnDestroy() {
    this.scroll.nativeElement.removeEventListener('scroll', () => this.onScroll());
  }

}
