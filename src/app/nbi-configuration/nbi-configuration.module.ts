import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NbiConfigurationComponent } from './nbi-configuration/nbi-configuration.component';
import { CommonConfigurationComponent } from './common/common-configuration/common-configuration.component';
import { CorbaConfigurationComponent } from './common/corba-configuration/corba-configuration.component';
import { I2ConfigurationComponent } from './common/i2-configuration/i2-configuration.component';
import { SocketConfigurationComponent } from './common/socket-configuration/socket-configuration.component';
import { SharedModule } from '../shared/shared.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    NbiConfigurationComponent,
    CommonConfigurationComponent,
    CorbaConfigurationComponent,
    I2ConfigurationComponent,
    SocketConfigurationComponent
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    NzBreadCrumbModule,
    FormsModule,
    ReactiveFormsModule,
    NzTabsModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: NbiConfigurationComponent
      }
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
  exports: [RouterModule]
})
export class NBIConfigurationModule {}
