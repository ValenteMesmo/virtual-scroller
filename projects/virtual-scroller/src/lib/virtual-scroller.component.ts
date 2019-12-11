import { Component, Input, ContentChild, TemplateRef, ViewChild, OnDestroy, AfterViewInit, ViewEncapsulation } from '@angular/core';

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
  pageSize = 5;
  magicNumber = 10;
  private onScroll() {

    if (!this.scroll) {
      return;
    }


    const scrollTop = this.scroll.nativeElement.scrollTop;
    const docHeight = this.items.length * this.magicNumber * this.pageSize;
    const scollIndex = Math.floor(((this.items.length * scrollTop) / docHeight));

    const pageHalf = Math.floor(this.pageSize / 2);
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
    this.visibleItems = this.items.slice(firstIndex, lastIndex);
  }

  resizeEmptySpaces(isLastIndex) {
    if (!isLastIndex) {
      return;
    }
    const scrollTop = this.scroll.nativeElement.scrollTop;
    const docHeight = this.items.length * this.magicNumber * this.pageSize;
    const scollIndex = Math.floor(((this.items.length * scrollTop) / docHeight));

    let additionalSize = 0;
    for (const i in this.scroll.nativeElement.childNodes) {
      if (this.scroll.nativeElement.childNodes[i]) {
        const element = this.scroll.nativeElement.childNodes[i];
        if (element && element.classList && !element.classList.contains('ignore')) {

          additionalSize += element.clientHeight;
        }
      }
    }

    // this.emptySizeBefore = (scollIndex * this.magicNumber * this.pageSize) + this.magicNumber * this.pageSize;
    this.emptySizeBefore = (scollIndex * this.magicNumber * this.pageSize) + this.magicNumber * this.pageSize;
    if (this.emptySizeBefore < 0) {
      this.emptySizeBefore = 0;
    }

    this.emptySizeAfter = docHeight - this.emptySizeBefore;
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
