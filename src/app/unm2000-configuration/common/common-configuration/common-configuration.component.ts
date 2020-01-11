import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from '../../../../environments/environment';
import { SharedService } from 'src/app/shared/shared.service';
import { TranslateService } from '@ngx-translate/core';

const apiUrl = environment.API_URL + '/basic/configure/';

interface CommonConfiguration {
  ctModeSwitch: string;
  emsStatusSwitch: string;
  heartBeatPortSwitch: string;
  snmpAgentSwitch: string;
  subShelfSwitch: string;
}

@Component({
  selector: 'app-common-configuration',
  templateUrl: './common-configuration.component.html',
  styleUrls: ['./common-configuration.component.scss']
})
export class CommonConfigurationComponent implements OnInit {

  subShelfSwitch = false;
  ctModeSwitch = false;
  emsStatusSwitch = false;
  heartBeatPortSwitch = false;
  snmpAgentSwitch = false;
  isLoading = false;
  isSpinning = false;
  langValue: any;

  constructor(
    private http: HttpClient,
    private message: NzMessageService,
    private sharedService: SharedService,
    public translate: TranslateService,
  ) {
    this.sharedService.defaultLanguage().subscribe(
      res => {
        console.log('default language==', res.data );
        switch (res.data) {
         case '0':
            this.langValue = 'en';
            break;
        case '1':
            this.langValue = 'ch';
            break;
        default:
        }

        translate.addLangs(['en', 'ch']);
        translate.setDefaultLang(this.langValue);
        const browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|ch/) ? this.langValue : 'ch');
      }
    );
   }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.isSpinning = true;
    this.http
      .get<{ code: number, data: CommonConfiguration, errorMessage: string, msg: string }>(apiUrl + 'getUnmCommonConfigData')
      .subscribe(
        res => {
          setTimeout(() => {
            this.isSpinning = false;
          }, 1000);
          if (res.code === 1000) {
            this.subShelfSwitch = res.data.subShelfSwitch === 'true' ? true : res.data.subShelfSwitch === 'false' ? false : null;
            this.emsStatusSwitch = res.data.emsStatusSwitch === 'true' ? true : res.data.emsStatusSwitch === 'false' ? false : null;
            this.ctModeSwitch = res.data.ctModeSwitch === 'true' ? true : res.data.ctModeSwitch === 'false' ? false : null;
            this.snmpAgentSwitch = res.data.snmpAgentSwitch === 'true' ? true : res.data.snmpAgentSwitch === 'false' ? false : null;
            this.heartBeatPortSwitch =
              res.data.heartBeatPortSwitch === 'true' ? true : res.data.heartBeatPortSwitch === 'false' ? false : null;
          }
        },
        err => {
          this.isSpinning = false;
        }
      );
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    const formData: CommonConfiguration = {
      subShelfSwitch: form.value.subShelfSwitch === true ? 'true' : 'false',
      emsStatusSwitch: form.value.emsStatusSwitch === true ? 'true' : 'false',
      ctModeSwitch: form.value.ctModeSwitch === true ? 'true' : 'false',
      snmpAgentSwitch: form.value.snmpAgentSwitch === true ? 'true' : 'false',
      heartBeatPortSwitch: form.value.heartBeatPortSwitch === true ? 'true' : 'false',
    };
    this.http
      .post<{ code: number, data: CommonConfiguration, errorMessage: string, msg: string }>(apiUrl + 'updateUnmCommonConfigData', formData)
      .subscribe(
        res => {
          this.isLoading = false;
          if (res.code === 1000) {
            this.message.success(this.translate.instant(this.sharedService.getSuccessMessage));
          }
        },
        err => {
          this.isLoading = false;
        }
      );
  }

}
