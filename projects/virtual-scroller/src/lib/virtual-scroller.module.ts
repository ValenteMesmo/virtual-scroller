import { NgModule } from '@angular/core';
import { VirtualScrollerComponent } from './virtual-scroller.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [VirtualScrollerComponent],
  imports: [
    CommonModule
  ],
  exports: [VirtualScrollerComponent]
})
export class VirtualScrollerModule { }
