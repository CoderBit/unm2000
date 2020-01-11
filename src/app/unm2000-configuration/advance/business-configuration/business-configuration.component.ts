import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from '../../../../environments/environment';
import { SharedService } from 'src/app/shared/shared.service';
import { TranslateService } from '@ngx-translate/core';
const apiUrl = environment.API_URL + '/business/configure/';

interface BusinessConfiguration {
  singleNeServiceSwitch: string;
}

@Component({
  selector: 'app-business-configuration',
  templateUrl: './business-configuration.component.html',
  styleUrls: ['./business-configuration.component.scss']
})
export class BusinessConfigurationComponent implements OnInit {
  isSpinning = false;
  isLoading = false;
  businessForm: FormGroup;
  switchValue = false;
  langValue: string;
  panels = [{ active: true, disabled: false, title: this.translate.instant('Basic Configuration') }];
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private message: NzMessageService,
    private sharedService: SharedService,
    public translate: TranslateService
  ) {
    this.sharedService.defaultLanguage().subscribe(
      res => {
        // res.data = '1';
        // console.log('default language==', res.data );
        switch (res.data) {
         case '0':
            this.langValue = 'en';
            break;
        case '1':
            this.langValue = 'ch';
            break;
        default:
        }
        // console.log('default value language==', this.langValue );
        translate.addLangs(['en', 'ch']);
        translate.setDefaultLang(this.langValue);
        const browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|ch/) ? this.langValue : 'ch');
      }
    );
  }

  ngOnInit() {
    this.businessForm = this.fb.group({
      singleNeServiceSwitch: new FormControl(this.switchValue)
    });
    this.fetchBusinessData();
  }

  fetchBusinessData() {
    this.isSpinning = true;
    this.http
      .get<{ code: number, data: BusinessConfiguration, errorMessage: string, msg: string }>(apiUrl + 'getIniBusiness')
      .subscribe(
        res => {
          if (res.code === 1000) {
            this.businessForm.patchValue({
              singleNeServiceSwitch: res.data.singleNeServiceSwitch === 'true' ? true : false,
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
    if (this.businessForm.invalid) {
      for (const field in this.businessForm.controls) {
        if (this.businessForm.controls.hasOwnProperty(field)) {
          this.businessForm.controls[field].markAsDirty();
          this.businessForm.controls[field].updateValueAndValidity();
        }
      }
      return;
    }
    this.isLoading = true;
    const formData: BusinessConfiguration = {
      singleNeServiceSwitch: this.businessForm.value.singleNeServiceSwitch,
    };
    this.http
      .post<{ code: number, data: BusinessConfiguration, errorMessage: string, msg: string }>(apiUrl + 'updateIniBusiness', formData)
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
