import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from '../../../../environments/environment';
import { SharedService } from 'src/app/shared/shared.service';
import { TranslateService } from '@ngx-translate/core';

const apiUrl = environment.API_URL + '/pon/configure/';

interface PonConfiguration {
  ponflowswitch: string;
  displayboardversion: string;
  onupollingtime: string;
  onunamecheck?: string | any;
  onufriendcheck?: string | any;
  onumaccheck?: string | any;
}

@Component({
  selector: 'app-pon-product-configuration',
  templateUrl: './pon-product-configuration.component.html',
  styleUrls: ['./pon-product-configuration.component.scss']
})
export class PonProductConfigurationComponent implements OnInit {

  panels = [{ active: true, disabled: false, title: this.translate.instant('Basic Configuration') }];
  panel2 = [{ active: true, disabled: false, title: this.translate.instant('onu_double_name_detection_configuration') }];
  isSpinning = false;
  isLoading = false;
  ponForm: FormGroup;
  switchValue = false;
  langValue: string;

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
    this.ponForm = this.fb.group({
      ponflowswitch : new FormControl(null),
      displayboardversion : new FormControl(null, [Validators.required]),
      onupollingtime : new FormControl(null, [Validators.required,
        Validators.pattern(this.sharedService.getAcceptOnlyNaturalNumbersValidation)]),
      onunamecheck : new FormControl(null),
      onufriendcheck : new FormControl(null),
      onumaccheck : new FormControl(null),
    });
    this.fetchPonproductData();
  }

  fetchPonproductData() {
    this.isSpinning = true;
    this.http
      .get<{ code: number, data: PonConfiguration, errorMessage: string, msg: string }>(apiUrl + 'getIniPon')
      .subscribe(
        res => {
          if (res.code === 1000) {
            this.ponForm.patchValue({
              ponflowswitch: res.data.ponflowswitch === 'true' ? true : false,
              displayboardversion: res.data.displayboardversion === 'true' ? 'true' : 'false',
              onupollingtime: res.data.onupollingtime,
              onunamecheck: res.data.onunamecheck === 'true' ? true : false,
              onufriendcheck: res.data.onufriendcheck === 'true' ? true : false,
              onumaccheck: res.data.onumaccheck === 'true' ? true : false,
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
    if (this.ponForm.invalid) {
      for (const field in this.ponForm.controls) {
        if (this.ponForm.controls.hasOwnProperty(field)) {
          this.ponForm.controls[field].markAsDirty();
          this.ponForm.controls[field].updateValueAndValidity();
        }
      }
      return;
    }
    // console.log(this.ponForm.value);
    this.isLoading = true;
    const formDataValue: PonConfiguration = {
      ponflowswitch: this.ponForm.value.ponflowswitch,
      displayboardversion: this.ponForm.value.displayboardversion,
      onupollingtime: this.ponForm.value.onupollingtime,
      onunamecheck: this.ponForm.value.onunamecheck,
      onufriendcheck: this.ponForm.value.onufriendcheck,
      onumaccheck: this.ponForm.value.onumaccheck

    };
    //  formDataValue;
    this.http
      .post<{ code: number, data: PonConfiguration, errorMessage: string, msg: string }>(apiUrl + 'updateIniPon', formDataValue)
      .subscribe(res => {
        this.isLoading = false;
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
