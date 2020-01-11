import { NgModule } from '@angular/core';
import { ConfigurationToolsComponent } from './configuration-tools/configuration-tools.component';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}


@NgModule({
  declarations: [
    ConfigurationToolsComponent
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    RouterModule.forChild([
      {path: '', component: ConfigurationToolsComponent}
    ]),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    RouterModule,
    ConfigurationToolsComponent
  ]
})

export class ConfigurationToolsModule {}
