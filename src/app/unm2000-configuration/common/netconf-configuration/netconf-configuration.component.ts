import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from '../../../../environments/environment';
import { SharedService } from 'src/app/shared/shared.service';
import { TranslateService } from '@ngx-translate/core';

const apiUrl = environment.API_URL + '/netconf/configure/';

interface NetConfConfiguration {
  netConfUserName: string;
  netConfPassword: string;
  netConfPort: string;
}


@Component({
  selector: 'app-netconf-configuration',
  templateUrl: './netconf-configuration.component.html',
  styleUrls: ['./netconf-configuration.component.scss']
})
export class NetconfConfigurationComponent implements OnInit {
  isSpinning = false;
  isLoading = false;
  langValue: string;
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private message: NzMessageService,
    public translate: TranslateService,
    private sharedService: SharedService
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
  panels = [{ active: true, disabled: false, title: 'Basic Configuration' }];
  netconfForm: FormGroup;
  ngOnInit() {
    this.netconfForm = this.fb.group({
      netConfUserName: [null, [Validators.required, Validators.maxLength(15)]],
      netConfPassword: [null, [Validators.required , Validators.maxLength(15)]],
      netConfPort: [null, [Validators.required,  Validators.pattern(this.sharedService.getNumberValidation)]]


    });
    this.fetchNetConfData();
  }

  fetchNetConfData() {
    this.isSpinning = true;
    this.http
      .get<{ code: number, data: NetConfConfiguration, errorMessage: string, msg: string }>(apiUrl + 'getIniData')
      .subscribe(res => {

        if (res.code === 1000) {
          this.netconfForm.patchValue({
            netConfUserName: res.data.netConfUserName,
            netConfPassword: res.data.netConfPassword,
            netConfPort: res.data.netConfPort
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
    if (this.netconfForm.invalid) {
      for (const field in this.netconfForm.controls) {
        if (this.netconfForm.controls.hasOwnProperty(field)) {
          this.netconfForm.controls[field].markAsDirty();
          this.netconfForm.controls[field].updateValueAndValidity();
        }
      }
      return;
    }
    this.isLoading = true;
    const formData: NetConfConfiguration = {
      netConfUserName: this.netconfForm.value.netConfUserName,
      netConfPassword: this.netconfForm.value.netConfPassword,
      netConfPort: this.netconfForm.value.netConfPort
    };
    this.http
      .post<{ code: number, data: NetConfConfiguration, errorMessage: string, msg: string }>(apiUrl + 'updateIniFile', formData)
      .subscribe(res => {
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
