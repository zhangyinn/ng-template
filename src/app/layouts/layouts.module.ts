import { DefaultLayoutComponent } from './../layouts/default-layout/default-layout.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [DefaultLayoutComponent],
  imports: [SharedModule],
  exports: [DefaultLayoutComponent],
})
export class LayoutsModule {}
