import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VirtualScrollForDirective } from './virtual-scroller';

@NgModule({
  declarations: [VirtualScrollForDirective],
  imports: [
    CommonModule
  ],
  exports: [VirtualScrollForDirective]
})
export class VirtualScrollerModule { }
