import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RoutesModule } from './routes/routes.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from '@core/core.module';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, CoreModule, RoutesModule, SharedModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
