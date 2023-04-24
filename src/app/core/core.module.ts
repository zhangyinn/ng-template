import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NetInterceptor } from './net/net.interceptor';

@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: NetInterceptor, multi: true },
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        `CoreModule has already been loaded. Import Core modules in the AppModule only.`
      );
    }
  }
}
