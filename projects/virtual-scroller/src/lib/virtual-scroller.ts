import {
    ChangeDetectorRef,
    Directive
    , ElementRef, Input
    , IterableDiffers
    , OnChanges
    , OnDestroy, SimpleChanges
    , TemplateRef
    , ViewContainerRef
} from '@angular/core';

import { NgForOf } from '@angular/common';

@Directive({
    selector: '[virtualScrollForOf]'
})
export class VirtualScrollForDirective<T> extends NgForOf<T> implements OnChanges, OnDestroy {

    _forOf: Array<any>;
    firstIndex = 0;
    lastIndex = 3;
    parent: any;

    @Input()
    set virtualScrollForOf(value: any) {
        this._forOf = value;
    }

    constructor(
        public viewContainerRef: ViewContainerRef,
        public templateRef: TemplateRef<any>,
        public differs: IterableDiffers,
        private element: ElementRef,
        private changeDetectorRef: ChangeDetectorRef) {
        super(viewContainerRef, templateRef, differs);
        this.parent = this.element.nativeElement.parentElement;
        this.parent.addEventListener('scroll', this.onParentScroll.bind(this));
    }

    ngOnDestroy(): void {
        this.parent.removeEventListener('scroll', this.onParentScroll.bind(this));
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.virtualScrollForOf) {

            console.log(this.parent.clientHeight);
            console.log(this.parent.scrollHeight);
            while (this.parent.scrollHeight <= this.parent.clientHeight) {
                super.ngForOf = this._forOf.slice(this.firstIndex, ++this.lastIndex);
                this.changeDetectorRef.detectChanges();
            }
            console.log(this.parent.clientHeight);
            console.log(this.parent.scrollHeight);
        }
    }

    onParentScroll() {
        if (this.parent.scrollTop + this.parent.clientHeight + 30 >= this.parent.scrollHeight) {
            super.ngForOf = this._forOf.slice(this.firstIndex, ++this.lastIndex);
            this.changeDetectorRef.detectChanges();
        }
    }
}