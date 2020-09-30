import {
    ChangeDetectorRef,
    Directive
    , ElementRef, Input
    , isDevMode, IterableDiffers
    , OnChanges
    , OnDestroy, SimpleChanges
    , TemplateRef
    , ViewContainerRef
} from '@angular/core';

import { NgForOf } from '@angular/common';

//testes a realizar
//  remover item do array
//  divs com height diferentes
//  array com 1 item
//  array vazio
//  drag scrollbar (pode ser necessario incrementar mais do que apenas um item por vez)
//  resize parent
// elementos com border
// elementos com margin
// elementos com padding

@Directive({
    selector: '[virtualScrollForOf]'
})
export class VirtualScrollForDirective<T> extends NgForOf<T> implements OnChanges, OnDestroy {

    _forOf: Array<any>;
    firstIndex = 0;
    lastIndex = 3;
    previousScrollTop = 0;
    parent: any;
    topPadding: HTMLDivElement;
    botPadding: HTMLDivElement;
    magicPixels: number;

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

        this.topPadding = document.createElement('div');
        if (isDevMode())
            this.topPadding.style.backgroundColor = 'red';
        this.topPadding.style.height = '0px';
        this.parent.insertAdjacentElement('afterbegin', this.topPadding);

        this.botPadding = document.createElement('div');
        if (isDevMode())
            this.botPadding.style.backgroundColor = 'blue';
        this.botPadding.style.height = '0px';
        this.parent.insertAdjacentElement('beforeend', this.botPadding);
    }

    ngOnDestroy(): void {
        this.parent.removeEventListener('scroll', this.onParentScroll.bind(this));
    }

    ngOnChanges(changes: SimpleChanges) {
        this.magicPixels = this.parent.clientHeight / 2;
        if (changes.virtualScrollForOf)
            while (this.parent.scrollHeight < this.parent.clientHeight + this.magicPixels) {
                super.ngForOf = this._forOf.slice(this.firstIndex, ++this.lastIndex);
                this.changeDetectorRef.detectChanges();
            }
    }

    getFirstElement(): HTMLElement {
        if (this.parent.childNodes.length < 3)
            return null;

        let index = 1;
        while (true) {
            if (this.parent.childNodes[index].nodeType !== 8)
                return this.parent.childNodes[index];

            index++;
            if (index > this.parent.childNodes.length)
                return null;
        }
    }

    getLastElement(): HTMLElement {
        if (this.parent.childNodes.length < 3)
            return null;

        let index = this.parent.childNodes.length - 2;
        while (true) {
            if (this.parent.childNodes[index].nodeType !== 8)
                return this.parent.childNodes[index];

            index--;
            if (index < 0)
                return null;
        }
    }

    onParentScroll() {
        if (this.parent.scrollTop > this.previousScrollTop)
            this.onParentScrollDown(this.parent.scrollTop - this.previousScrollTop);
        else
            this.onParentScrollUp(this.previousScrollTop - this.parent.scrollTop);

        this.previousScrollTop = this.parent.scrollTop;
    }

    onParentScrollUp(delta) {

        while (delta > 0) {
            if (this.removeBotItem()) {
                //delta -= this.getFirstElement().clientHeight;
            }

            if (this.addTopItem())
                delta -= this.getFirstElement().clientHeight;
                else break;
            

        }
    }

    onParentScrollDown(delta) {
        while (delta > 0) {
            if(this.removeTopItem()){}

            if (this.addBotItem())
                delta -= this.getLastElement().clientHeight;
                else break;

            
        }
    }

    isScrolledIntoView(elem) {
        let docViewBottom = this.parent.scrollTop + this.parent.clientHeight;

        let elemTop = elem.offsetTop;
        let elemBottom = elemTop + elem.clientHeight;

        return elemBottom <= docViewBottom
            && elemTop >= this.parent.scrollTop;
    }

    almostShowingIntoViewWhenScrollingUp(elem) {
        let docViewBottom = this.parent.scrollTop + this.parent.clientHeight;

        let elemTop = elem.offsetTop;
        let elemBottom = elemTop + elem.clientHeight;

        return elemBottom + this.magicPixels > this.parent.scrollTop;
    }

    almostShowingIntoViewWhenScrollingDown(elem) {
        let docViewBottom = this.parent.scrollTop + this.parent.clientHeight;

        let elemTop = elem.offsetTop;
        let elemBottom = elemTop + elem.clientHeight;

        let viewBot = this.parent.scrollTop + this.parent.clientHeight;
        return elemTop - this.magicPixels < viewBot;
    }

    scrolledUpOutOfView(elem) {
        let docViewBottom = this.parent.scrollTop + this.parent.clientHeight;

        let elemTop = elem.offsetTop;
        let elemBottom = elemTop + elem.clientHeight;

        let viewBot = this.parent.scrollTop + this.parent.clientHeight;
        return elemTop > viewBot;
    }

    scrolledDownOfView(elem) {
        let docViewBottom = this.parent.scrollTop + this.parent.clientHeight;

        let elemTop = elem.offsetTop;
        let elemBottom = elemTop + elem.clientHeight;

        return elemBottom < this.parent.scrollTop;
    }

    shouldAddBotItem() {
        let lastItem = this.getLastElement();
        if (!lastItem)
            return true;

        if (this.almostShowingIntoViewWhenScrollingDown(lastItem))
            return true;

            let docViewBottom = this.parent.scrollTop + this.parent.clientHeight;

            let elemTop = this.botPadding.offsetTop;           
    
            // return elemTop >= this.parent.scrollTop;

            return false;
        // return this.parent.scrollTop + this.parent.clientHeight
        //     >= this.parent.scrollHeight - this.botPadding.clientHeight - this.magicPixels;
    }

    shouldAddTopItem() {
        let first = this.getFirstElement();
        if (!first)
            return true;

        if (this.almostShowingIntoViewWhenScrollingUp(first))
            return true;

            
            return false;
        // return this.parent.scrollTop
        //     <= this.topPadding.clientHeight + this.magicPixels;
    }

    shouldRemoveBotItem() {
        // if (this.isScrolledIntoView(this.botPadding))
        //     return false;

        // if (this.isScrolledIntoView(this.topPadding))
        //     return false;

        if (this.firstIndex == 0)
            return false;

        let lastItem = this.getLastElement();
        // return !this.isScrolledIntoView(lastItem);
        if (!lastItem)
            return false;
        let docViewBottom = this.parent.scrollTop + this.parent.clientHeight;

        let elemTop = lastItem.offsetTop;
        let elemBottom = elemTop + lastItem.clientHeight;

        return !((elemBottom <= docViewBottom) && (elemTop >= this.parent.scrollTop));
    }

    shoudRemoveTopItem() {
        // if (this.isScrolledIntoView(this.botPadding))
        //     return false;

        // if (this.isScrolledIntoView(this.topPadding))
        //     return false;

        if (this.lastIndex == this._forOf.length - 1)
            return false;

        let firstElement = this.getFirstElement();
        if (!firstElement)
            return false;
        // return !this.isScrolledIntoView(firstElement );
        let docViewBottom = this.parent.scrollTop + this.parent.clientHeight;

        let elemTop = firstElement.offsetTop;
        let elemBottom = elemTop + firstElement.clientHeight;

        return !((elemBottom <= docViewBottom) && (elemTop >= this.parent.scrollTop));
    }

    addTopItem() {
        if (!this.shouldAddTopItem())
            return false;

        this.firstIndex--;
        if (this.firstIndex < 0) {
            this.firstIndex = 0;
            return false;
        }
        super.ngForOf = this._forOf.slice(this.firstIndex, this.lastIndex);
        this.changeDetectorRef.detectChanges();

        let firstElement = this.getFirstElement();
        if (!firstElement)
            return false;

        let height = parseInt(this.topPadding.style.height) - firstElement.clientHeight;
        if (height < 0)
            height = 0;
        this.topPadding.style.height = `${height}px`;

        this.changeDetectorRef.detectChanges();
        return true
    }

    addBotItem() {

        if (!this.shouldAddBotItem())
            return false;

        this.lastIndex++;
        if (this.lastIndex > this._forOf.length - 1) {
            this.lastIndex = this._forOf.length - 1;
            return false;
        }
        super.ngForOf = this._forOf.slice(this.firstIndex, this.lastIndex);
        this.changeDetectorRef.detectChanges();

        let lastElement = this.getLastElement();
        if (!lastElement)
            return false;
        let height = parseInt(this.botPadding.style.height) - lastElement.clientHeight;
        if (height < 0)
            height = 0;
        this.botPadding.style.height = `${height}px`;

        this.changeDetectorRef.detectChanges();
        return true;
    }

    removeTopItem() {
        if (!this.shoudRemoveTopItem())
            return false;

        let firstItem = this.getFirstElement();
        if (!firstItem || this.isScrolledIntoView(firstItem))
            return false;

        if (this.lastIndex == this._forOf.length - 1)
            return false;

        this.firstIndex++;
        if (this.firstIndex > this._forOf.length - 1) {
            this.firstIndex = this._forOf.length - 1;
            return false;
        }

        this.topPadding.style.height = `${parseInt(this.topPadding.style.height)
            + firstItem.clientHeight
            }px`;

        super.ngForOf = this._forOf.slice(this.firstIndex, this.lastIndex);
        this.changeDetectorRef.detectChanges();
        return true;
    }

    removeBotItem() {
        if (!this.shouldRemoveBotItem())
            return false;

        let lastItem = this.getLastElement();
        if (!lastItem || this.isScrolledIntoView(lastItem))
            return false;

        if (this.firstIndex == 0)
            return false;

        this.lastIndex--;
        if (this.lastIndex < 0) {
            this.lastIndex = 0;
            return false;
        }

        this.botPadding.style.height =
            `${parseInt(this.botPadding.style.height) + lastItem.clientHeight}px`;
        super.ngForOf = this._forOf.slice(this.firstIndex, this.lastIndex);
        this.changeDetectorRef.detectChanges();

        return true;
    }


}