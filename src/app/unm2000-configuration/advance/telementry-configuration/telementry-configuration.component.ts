import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from '../../../../environments/environment';
import { SharedService } from 'src/app/shared/shared.service';
import { TranslateService } from '@ngx-translate/core';
const apiUrl = environment.API_URL + '/telemetry/configure/';

interface TelemenryConfiguration {
  parseThread: string;
  processThread: string;
  popMultidata: string;
  telemetryUdpSwitch: string;
}

@Component({
  selector: 'app-telementry-configuration',
  templateUrl: './telementry-configuration.component.html',
  styleUrls: ['./telementry-configuration.component.scss']
})
export class TelementryConfigurationComponent implements OnInit {

  telementryForm: FormGroup;
  switchvalue = false;

  isLoading = false;
  isSpinning = false;
  langValue: string;

  panels = [ { active: true, disabled: false, title: this.translate.instant('Basic Configuration')}];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private message: NzMessageService,
    private sharedService: SharedService,
    public translate: TranslateService
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
        console.log('default value language==', this.langValue );
        translate.addLangs(['en', 'ch']);
        translate.setDefaultLang(this.langValue);
        const browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|ch/) ? this.langValue : 'ch');
      }
    );
   }



  ngOnInit() {
    this.telementryForm = this.fb.group({
      telemetryUdpSwitch: [this.switchvalue],
      parseThread: [null, [Validators.required, Validators.pattern(this.sharedService.getNumberValidation)]],
      processThread: [null , [Validators.required, Validators.pattern(this.sharedService.getNumberValidation)]],
      popMultidata: [null , [Validators.required, Validators.pattern(this.sharedService.getNumberValidation)]]
    });
    this.fetchTelementryData();
  }

  fetchTelementryData() {
    this.isSpinning = true;
    this.http
      .get<{ code: number, data: TelemenryConfiguration, errorMessage: string, msg: string }>(apiUrl + 'getIniTelemetryData')
      .subscribe(
        res => {
          console.log(res.data.telemetryUdpSwitch);

          if (res.code === 1000) {
            this.telementryForm.patchValue({
              parseThread: res.data.parseThread,
              processThread: res.data.processThread,
              popMultidata: res.data.popMultidata,
              telemetryUdpSwitch: res.data.telemetryUdpSwitch === 'true' ? true : false,
            });
            setTimeout(() => {
              this.isSpinning = false;
            }, 1000);

          }
        },
        err => {
          this.isSpinning = false;
        }
      );
  }

  submitForm(): void {
    if (this.telementryForm.invalid) {
      for (const field in this.telementryForm.controls) {
        if (this.telementryForm.controls.hasOwnProperty(field)) {
          this.telementryForm.controls[field].markAsDirty();
          this.telementryForm.controls[field].updateValueAndValidity();
        }
      }
      return;
    }
    this.isLoading = true;
    const formData: TelemenryConfiguration = {
      parseThread: this.telementryForm.value.parseThread,
      processThread: this.telementryForm.value.processThread,
      popMultidata: this.telementryForm.value.popMultidata,
      telemetryUdpSwitch: this.telementryForm.value.telemetryUdpSwitch
    };
    this.http
      .post<{ code: number, data: TelemenryConfiguration, errorMessage: string, msg: string }>(apiUrl + 'updateIniTelemetryData', formData)
      .subscribe(res => {
        this.isLoading = false;
        if (res.code === 1000) {
            this.message.success(this.translate.instant(this.sharedService.getSuccessMessage));
          }
      },
        res => {
          this.isLoading = false;
        }
      );
  }

}
