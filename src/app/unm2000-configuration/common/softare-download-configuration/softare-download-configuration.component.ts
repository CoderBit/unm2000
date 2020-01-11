import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, PatternValidator } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from '../../../../environments/environment';
import { SharedService } from 'src/app/shared/shared.service';
import { TranslateService } from '@ngx-translate/core';
const apiUrl = environment.API_URL + '/softwareDownload/configure/';

interface SoftwareDownloadConf {
  boardRetransmissionTimes: string;
  packageLength: string;
  clientFtpIP: string;
  deviceFtpIP: string;

}

@Component({
  selector: 'app-softare-download-configuration',
  templateUrl: './softare-download-configuration.component.html',
  styleUrls: ['./softare-download-configuration.component.scss']
})
export class SoftareDownloadConfigurationComponent implements OnInit {
  isSpinning = false;
  langValue: string;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
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

  isLoading = false;
  panels = [{ active: true, disabled: false, title: 'Basic Configuration' }];
  softwareForm: FormGroup;
  ngOnInit() {
    this.softwareForm = this.fb.group({
      boardRetransmissionTimes: [null, [Validators.required, Validators.pattern(this.sharedService.getAcceptOnlyNaturalNumbersValidation)]],
      packageLength: [null, [Validators.required, Validators.pattern(this.sharedService.getAcceptOnlyNaturalNumbersValidation)]],
      clientFtpIP: [null, [Validators.required, Validators.pattern(this.sharedService.getIpPatternValidation)]],
      deviceFtpIP: [null, [Validators.required, Validators.pattern(this.sharedService.getIpPatternValidation)]]
    });
    this.fetchDataSoftwareDownload();
  }

  submitForm(): void {
    if (this.softwareForm.invalid) {
      for (const field in this.softwareForm.controls) {
        if (this.softwareForm.controls.hasOwnProperty(field)) {
          this.softwareForm.controls[field].markAsDirty();
          this.softwareForm.controls[field].updateValueAndValidity();
        }
      }
      return;
    }
    this.isLoading = true;
    const formData: SoftwareDownloadConf = {
      boardRetransmissionTimes: this.softwareForm.value.boardRetransmissionTimes,
      packageLength: this.softwareForm.value.packageLength,
      clientFtpIP: this.softwareForm.value.clientFtpIP,
      deviceFtpIP: this.softwareForm.value.deviceFtpIP
    };
    this.http
      .post<{code: number, data: SoftwareDownloadConf, errorMessage: string, msg: string}>(apiUrl + 'updateSoftwareDownloadData', formData)
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

  fetchDataSoftwareDownload() {
    this.isSpinning = true;
    this.http
      .get<{ code: number, data: SoftwareDownloadConf, errorMessage: string, msg: string }>(apiUrl + 'getSoftwareDownloadData')
      .subscribe(
        res => {
          if (res.code === 1000) {
            this.softwareForm.patchValue({
              boardRetransmissionTimes: res.data.boardRetransmissionTimes,
              packageLength: res.data.packageLength,
              clientFtpIP: res.data.clientFtpIP,
              deviceFtpIP: res.data.deviceFtpIP
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

}
