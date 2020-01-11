import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from '../../../../environments/environment';
import { SharedService } from 'src/app/shared/shared.service';
import { TranslateService } from '@ngx-translate/core';
const apiUrl = environment.API_URL + '/basic/configure/';


interface AnsonConfConfiguration {
  asonSwitch: string;
  asonSimulatorSwitch: string;

}


@Component({
  selector: 'app-ason-configuration',
  templateUrl: './ason-configuration.component.html',
  styleUrls: ['./ason-configuration.component.scss']
})
export class AsonConfigurationComponent implements OnInit {
  langValue: string;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private message: NzMessageService,
    public translate: TranslateService,
    private sharedService: SharedService
  ) { this.sharedService.defaultLanguage().subscribe(
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
  ); }
  switchValue = 'false';
  panels = [{ active: true, disabled: false, title: 'Basic Configuration' }];
  asonconfigForm: FormGroup;
  isSpinning = false;
  isLoading = false;
  ngOnInit() {
    this.asonconfigForm = this.fb.group({
      asonSwitch: new FormControl(null, [Validators.required]),
      asonSimulatorSwitch: new FormControl('null')

    });
    this.fetchAsonData();
  }

  fetchAsonData() {
    this.isSpinning = true;
    this.http
      .get<{ code: number, data: AnsonConfConfiguration, errorMessage: string, msg: string }>(apiUrl + 'getUnmAsonConfigData')
      .subscribe(
        res => {
          if (res.code === 1000) {
            this.asonconfigForm.patchValue({
              asonSwitch: res.data.asonSwitch === 'true' ? true : false,
              asonSimulatorSwitch: res.data.asonSimulatorSwitch !== '1' ? false : true,
            });
            console.log('res.data.asonSimulatorSwitch ', res.data.asonSimulatorSwitch);
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
    if (this.asonconfigForm.invalid) {
      for (const field in this.asonconfigForm.controls) {
        if (this.asonconfigForm.controls.hasOwnProperty(field)) {
          this.asonconfigForm.controls[field].markAsDirty();
          this.asonconfigForm.controls[field].updateValueAndValidity();
        }
      }
      return;
    }
    this.isLoading = true;
    const formData: AnsonConfConfiguration = {
      asonSwitch: this.asonconfigForm.value.asonSwitch,
      asonSimulatorSwitch: this.asonconfigForm.value.asonSimulatorSwitch === true ? '1' : '0',
    };
    this.http
      .post<{ code: number, data: AnsonConfConfiguration, errorMessage: string, msg: string }>(apiUrl + 'updateUnmAsonConfigData', formData)
      .subscribe(res => {
        if (res.code === 1000) {
          this.isLoading = false;
          this.message.success(this.translate.instant(this.sharedService.getSuccessMessage));
        }
      },
        res => {
          this.isLoading = false;
        }
      );
  }

}
