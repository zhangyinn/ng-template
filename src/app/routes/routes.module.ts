import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RoutesRoutingModule } from './routes-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [LoginComponent, PageNotFoundComponent],
  imports: [RoutesRoutingModule],
})
export class RoutesModule {}
