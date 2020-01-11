import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SharedService } from 'src/app/shared/shared.service';
import { NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';

const apiUrl = environment.API_URL + '/basic/xml/';

@Component({
  selector: 'app-common-configuration',
  templateUrl: './common-configuration.component.html',
  styleUrls: ['./common-configuration.component.scss']
})
export class CommonConfigurationComponent implements OnInit {
  commonForm: FormGroup;
  isSpinning = false;
  isLoading = false;
  value = '';
  langValue: string;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private sharedService: SharedService,
    private message: NzMessageService,
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
    console.log('common configuration');
}

  listOfControl: Array<{ id: number; controlInstance: string }> = [];

  ngOnInit(): void {
    this.commonForm = this.fb.group({
      nbi_layer_param: new FormControl(null, [Validators.required]),
      read_slot_state: new FormControl(null, [Validators.required]),
      port_display_mode: new FormControl(null, [Validators.required]),
      nativename_with_type_flag: new FormControl(null, [Validators.required]),
      compressType: new FormControl(null, [Validators.required]),
      ip: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.sharedService.getIpPatternValidation)
      ]),
      port: new FormControl(null, [Validators.required, Validators.pattern(this.sharedService.getAcceptOnlyNaturalNumbersValidation)]),
      pwd: new FormControl(null, [Validators.required]),
      type: new FormControl(null, [Validators.required]),
      user: new FormControl(null, [Validators.required])
    });

    this.fetchData();
  }

  submitForm(): void {
    if (this.commonForm.invalid) {
      for (const field in this.commonForm.controls) {
        if (this.commonForm.controls.hasOwnProperty(field)) {
          this.commonForm.controls[field].markAsDirty();
          this.commonForm.controls[field].updateValueAndValidity();
        }
      }
      return;
    }
    this.isLoading = true;
    const sendData = this.commonForm.value;
    this.http.post<{ code: number; data: any; errorMessage: string; message: string }>(apiUrl + 'setCommonConfig', sendData).subscribe(
      res => {
        if (res.code === 1000) {
          this.message.success(this.translate.instant(this.sharedService.getSuccessMessage));
        }
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
        console.log(err);
      }
    );
  }

  fetchData() {
    this.isSpinning = true;
    const nbiCommonConfig = ['ftp_config', 'read_slot_state', 'port_display_mode', 'nativename_with_type_flag'];
    this.http.get<{ code: number; data: any; errorMessage: string; message: string }>(apiUrl + 'fetchXmlData/nbiConfig').subscribe(
      res => {
        setTimeout( () => {
          this.isSpinning = false;
        }, 1000);
        if (res.code === 1000) {
          const nbiLayerParam = res.data.nbi_layer_param === 'true' ? 'true' : res.data.nbi_layer_param === 'false' ? 'false' : null;
          this.commonForm.patchValue({
            nbi_layer_param: nbiLayerParam
          });
          const lists = res.data.xmlData.configlist.config;
          const nbiCommonData = lists.find(data => data.name.toLocaleLowerCase() === 'common');
          for (const item of nbiCommonData.ftpConfigOrTestfalgOrNativenameWithTypeFlag) {
            const isPresent = nbiCommonConfig.includes(item.name);
            if (isPresent) {
              if (typeof item.value === 'object') {
                switch (item.name) {
                  case 'ftp_config':
                    const nestData = item.value;
                    for (const key in nestData) {
                      if (nestData.hasOwnProperty(key)) {
                        this.commonForm.patchValue({
                          [key]: nestData[key] !== null ? nestData[key].toLocaleLowerCase() : null
                        });
                        switch (key) {
                          case 'type':
                            const typeValue = nestData[key].toLocaleLowerCase();
                            const ftpConfType = typeValue === 'ftp' ? 'ftp' : typeValue === 'sftp' ? 'sftp' : null;
                            this.commonForm.patchValue({
                              type: ftpConfType
                            });
                            break;
                          case 'compressType':
                            const compressTypeValue = nestData[key].toLocaleLowerCase();
                            const ftpConfCompressType = compressTypeValue === '0' ? '0' : compressTypeValue === '1' ? '1' : null;
                            this.commonForm.patchValue({
                              compressType: ftpConfCompressType
                            });
                            break;
                        }
                      }
                    }
                    break;
                  case 'read_slot_state':
                    this.commonForm.patchValue({
                      [item.name]: item.value.fromDevice === '1' ? '1' : item.value.fromDevice === '0' ? '0' : null
                    });
                    break;
                }
              } else if (typeof item.value !== 'object') {
                this.commonForm.patchValue({
                  [item.name]: item.value
                });
                switch (item.name) {
                  case 'port_display_mode':
                    const portDisplayMode = item.value === '0' ? '0' : item.value === '1' ? '1' : item.value === '2' ? '2' : null;
                    this.commonForm.patchValue({
                      port_display_mode: portDisplayMode
                    });
                    break;
                  case 'nativename_with_type_flag':
                    const nativenameFlag = item.value === '0' ? '0' : item.value === '1' ? '1' : null;
                    this.commonForm.patchValue({
                      nativename_with_type_flag: nativenameFlag
                    });
                    break;
                }
              }
            }
          }
        }
      },
      err => {
        this.isSpinning = false;
      }
    );
  }

  onFtpTypeChange(value) {
    if (value) {
      this.commonForm.patchValue({
        port: value === 'ftp' ? '21' : '22'
      });
    }
  }

  // onChange(value: string): void {
  //   if (value) {
  //     console.log('onChange');
  //     const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
  //     if ((!isNaN(+value) && reg.test(value)) || value === '' || value === '-') {
  //       this.value = value;
  //     }
  //     console.log(this.value);
  //     this.inputElement.nativeElement.value = this.value;
  //     // this.commonForm.patchValue({
  //     //   port: this.value
  //     // });
  //   }
  // }


}
