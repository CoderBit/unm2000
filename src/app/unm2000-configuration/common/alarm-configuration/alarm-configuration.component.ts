import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from '../../../../environments/environment';
import { SharedService } from 'src/app/shared/shared.service';
import { TranslateService } from '@ngx-translate/core';
const apiUrl = environment.API_URL + '/alarmconf/configure/';

interface AlarmConfConfiguration {
  alarmDelayDealSwitch: string;
  alarmAutomaticSynchronisationSwitch: string;
  alarmAutomaticAynchronizationInterval: string;
  alarmCorrelationAnalysisSwitch: string;
}

@Component({
  selector: 'app-alarm-configuration',
  templateUrl: './alarm-configuration.component.html',
  styleUrls: ['./alarm-configuration.component.scss']
})
export class AlarmConfigurationComponent implements OnInit {
  isLoading = false;
  isSpinning = false;
  alarmForm: FormGroup;
  langValue: string;

  constructor(
    private fb: FormBuilder,
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
        console.log('default value language==', this.langValue );
        translate.addLangs(['en', 'ch']);
        translate.setDefaultLang(this.langValue);
        const browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|ch/) ? this.langValue : 'ch');
      }
    );
   }
  listOfControl: Array<{ id: number; controlInstance: string }> = [];

  panels = [{ active: true, disabled: false, title: 'Basic Configuration' }];

  ngOnInit(): void {
    this.alarmForm = this.fb.group({
      alarmDelayDealSwitch: [null],
      alarmAutomaticSynchronisationSwitch: [null],
      alarmAutomaticAynchronizationInterval: [
        null,
        [
          Validators.required,
          Validators.pattern(this.sharedService.getAcceptOnlyNaturalNumbersValidation)
        ]
      ],
      alarmCorrelationAnalysisSwitch: [null]
    });
    this.fetchAlarmData();
  }

  fetchAlarmData() {
    this.isSpinning = true;
    this.http
      .get<{ code: number, data: AlarmConfConfiguration, errorMessage: string, msg: string }>(apiUrl + 'getIniAlarmData')
      .subscribe(
        res => {
          if (res.code === 1000) {
            this.alarmForm.patchValue({
              alarmAutomaticAynchronizationInterval: res.data.alarmAutomaticAynchronizationInterval,
              alarmAutomaticSynchronisationSwitch: res.data.alarmAutomaticSynchronisationSwitch !== '1' ? false : true,
              alarmCorrelationAnalysisSwitch: res.data.alarmCorrelationAnalysisSwitch === 'true' ? true : false,
              alarmDelayDealSwitch: res.data.alarmDelayDealSwitch === 'true' ? true : false
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
    if (this.alarmForm.invalid) {
      return;
    }
    this.isLoading = true;
    const formData: AlarmConfConfiguration = {
      alarmDelayDealSwitch: this.alarmForm.value.alarmDelayDealSwitch,
      alarmAutomaticSynchronisationSwitch: this.alarmForm.value.alarmAutomaticSynchronisationSwitch === true ? '1' : '0',
      alarmAutomaticAynchronizationInterval: this.alarmForm.value.alarmAutomaticAynchronizationInterval,
      alarmCorrelationAnalysisSwitch: this.alarmForm.value.alarmCorrelationAnalysisSwitch
    };

    this.http
      .post<{ code: number, data: AlarmConfConfiguration, errorMessage: string, msg: string }>(apiUrl + 'updateIniFile', formData)
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
