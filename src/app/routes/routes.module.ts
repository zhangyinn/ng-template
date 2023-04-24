import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RoutesRoutingModule } from './routes-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SharedModule } from '@shared/shared.module';
import { LayoutsModule } from '../layouts/layouts.module';

@NgModule({
  declarations: [LoginComponent, PageNotFoundComponent],
  imports: [SharedModule, LayoutsModule, RoutesRoutingModule],
})
export class RoutesModule {}
