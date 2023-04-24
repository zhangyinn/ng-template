import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CategoryComponent } from './category.component';
import { CategoryRoutingModule } from './category-routing.module';

@NgModule({
  declarations: [CategoryComponent],
  imports: [SharedModule, CategoryRoutingModule],
})
export class CategoryModule {}
