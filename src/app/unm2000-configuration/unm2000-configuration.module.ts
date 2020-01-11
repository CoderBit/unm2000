import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule, NzConfig, NZ_CONFIG } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzMessageModule } from 'ng-zorro-antd/message';

import { Unm2000ConfigurationComponent } from './unm2000-configuration/unm2000-configuration.component';
import { CommonConfigurationComponent } from './common/common-configuration/common-configuration.component';
import { PerformanceConfigurationComponent } from './common/performance-configuration/performance-configuration.component';
import { NetconfConfigurationComponent } from './common/netconf-configuration/netconf-configuration.component';
import { SoftareDownloadConfigurationComponent } from './common/softare-download-configuration/softare-download-configuration.component';
import { AsonConfigurationComponent } from './common/ason-configuration/ason-configuration.component';
// tslint:disable-next-line:max-line-length
import { SimulationTestConfigurationComponent } from './simulation-test/simulation-test-configuration/simulation-test-configuration.component';
import { TelementryConfigurationComponent } from './advance/telementry-configuration/telementry-configuration.component';
import { BusinessConfigurationComponent } from './advance/business-configuration/business-configuration.component';
import { PonProductConfigurationComponent } from './advance/pon-product-configuration/pon-product-configuration.component';
import { AlarmConfigurationComponent } from './common/alarm-configuration/alarm-configuration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SupportNeTypeComponent } from './advance/smart-clock-configuration/support-ne-type/support-ne-type.component';
import { SupportBoardTypeComponent } from './advance/smart-clock-configuration/support-board-type/support-board-type.component';
import { SquareDirective } from '../shared/square.directive';
import { SharedModule } from '../shared/shared.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

const ngZorroConfig: NzConfig = {
  message: { nzTop: 120, nzMaxStack: 1, nzDuration: 1500 },
  notification: { nzTop: 240 }
};

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    Unm2000ConfigurationComponent,
    CommonConfigurationComponent,
    PerformanceConfigurationComponent,
    NetconfConfigurationComponent,
    SoftareDownloadConfigurationComponent,
    AsonConfigurationComponent,
    SimulationTestConfigurationComponent,
    TelementryConfigurationComponent,
    BusinessConfigurationComponent,
    PonProductConfigurationComponent,
    AlarmConfigurationComponent,
    SupportNeTypeComponent,
    SupportBoardTypeComponent,
    SquareDirective
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    NzBreadCrumbModule,
    FormsModule,
    ReactiveFormsModule,
    NzTabsModule,
    NzMessageModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: Unm2000ConfigurationComponent
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
  exports: [RouterModule],
  providers: [{ provide: NZ_CONFIG, useValue: ngZorroConfig }]
})
export class UnmConfigurationModule { }
