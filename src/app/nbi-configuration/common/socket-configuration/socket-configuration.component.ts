import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';
import { NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';

declare var require: any;
const apiUrl = environment.API_URL + '/basic/xml/';

@Component({
  selector: 'app-socket-configuration',
  templateUrl: './socket-configuration.component.html',
  styleUrls: ['./socket-configuration.component.scss']
})
export class SocketConfigurationComponent implements OnInit {

  socketForm: FormGroup;
  switchvalue = false;
  isFetching = false;
  isSubmitting = false;
  nzOptions: any[] | null = null;
  values: any[] | null = null;
  cityCode = null;
  langValue: string;
  cityy = require('./city.json');
  listOfOption: Array<{ label: string; value: string }> = [
    { label: 'SDH', value: 'SDH' },
    { label: 'OTN', value: 'OTN' },
    { label: 'WDM', value: 'WDM' },
    { label: 'PTN', value: 'PTN' },
    { label: 'PON', value: 'PON' }
  ];
  listOfSelectedValue = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private sharedService: SharedService,
    private message: NzMessageService,
    public translate: TranslateService
  ) { this.sharedService.defaultLanguage().subscribe(
    res => {
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
  ); }

  ngOnInit() {

    this.socketForm = this.fb.group({
      enable: new FormControl(null),
      omc_no: new FormControl(null, [Validators.required, Validators.pattern(this.sharedService.getNumbersAndLettersBothValidation)]),
      omc_name: new FormControl(null, [Validators.required]),
      management_device_type: new FormControl(null, [Validators.required]),
      city_shortname: new FormControl(null, [Validators.required]),
      ip: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.sharedService.getIpPatternValidation)
      ]),
      port: new FormControl(null, [Validators.required, Validators.pattern(this.sharedService.getAcceptOnlyNaturalNumbersValidation)]),
      pwd: new FormControl(null, [Validators.required]),
      type: new FormControl(null, [Validators.required]),
      user: new FormControl(null, [Validators.required]),
    });

    this.fetchData();
    this.nzOptions = this.cityy;
    // this.makeJSON();
  }

  // makeJSON() {
  //   const procity = this.cityy.city_data;
  //   const newPro = [];
  //   console.log('makeJSON', procity.length);
  //   for (let i = 0; i < procity.length; i++) {
  //     if ( i !== 0 ) {
  //       if ( procity[i].provinceName !== procity[i - 1].provinceName) {
  //         newPro.push({ value: procity[i].provinceShortname, label: procity[i].provinceName, children: [] });
  //       }
  //     } else {
  //       newPro.push({ value: procity[i].provinceShortname, label: procity[i].provinceName, children: [] });
  //     }
  //   }
  //   console.log(newPro);
  //   console.log(JSON.stringify(newPro));
  //   for (const data of procity) {
  //     const index = newPro.findIndex(temp => temp.value === data.provinceShortname);
  //     newPro[index].children.push({ value: `${data.cityShortname}/${data.cityCode}`, label: data.cityName, isLeaf: true });
  //   }
  //   console.log(newPro);
  //   console.log(JSON.stringify(newPro));
  // }

  fetchData() {
    this.isFetching = true;
    let equipmentDomain = null;
    // tslint:disable-next-line:max-line-length
    const socketConfig = ['enable', 'omc_no', 'omc_name', 'equipment_domain', 'dump_cfgtype', 'pas_pm_data_ftp_info', 'city_shortname', 'city_code'];
    this.http.get<{ code: number; data: any; errorMessage: string; message: string }>(apiUrl + 'fetchXmlData/nbiConfig').subscribe(
      res => {
        setTimeout( () => {
          this.isFetching = false;
        }, 1000);
        if (res.code === 1000) {
          const lists = res.data.xmlData.configlist.config;
          const socketData = lists.find(data => data.name.toLocaleLowerCase() === 'socket');
          for (const item of socketData.ftpConfigOrTestfalgOrNativenameWithTypeFlag) {
            const isPresent = socketConfig.includes(item.name);
            if (isPresent) {
              if (typeof item.value === 'object') {
                const nestData = item.value;
                for (const key in nestData) {
                  if (nestData.hasOwnProperty(key)) {
                    this.socketForm.patchValue({
                      [key]: nestData[key] !== null ? nestData[key].toLocaleLowerCase() : null
                    });
                    switch (key) {
                      case 'type':
                        const typeValue = nestData[key] !== null ? nestData[key].toLocaleLowerCase() : null;
                        const ftpConfType = typeValue === 'ftp' ? 'ftp' : typeValue === 'sftp' ? 'sftp' : null;
                        this.socketForm.patchValue({
                          type: ftpConfType
                        });
                        break;
                    }
                  }
                }
              } else {
                this.socketForm.patchValue({
                  [item.name]: item.value
                });
                switch (item.name) {
                  case 'enable':
                    this.switchvalue = item.value === 'true' ? true : false;
                    if (this.switchvalue) {
                      this.socketForm.enable();
                    } else {
                      this.socketForm.disable();
                      this.socketForm.get('enable').enable();
                    }
                    this.socketForm.patchValue({
                      enable: item.value === 'true' ? true : false
                    });
                    break;
                  case 'equipment_domain':
                    equipmentDomain = item.value;
                    this.listOfSelectedValue = equipmentDomain.split(',');
                    break;
                  case 'city_code':
                    this.cityCode = item.value;
                    break;
                  case 'city_shortname':
                    const provinceShortName = item.value.split('/')[0];
                    const cityShortName = item.value.split('/')[1];
                    // console.log(item, provinceShortName, cityShortName);
                    // console.log(this.cityy);
                    this.cityy.forEach(province => {
                      if (province.value === provinceShortName) {
                        province.children.forEach(city => {
                          const cityName = city.value.split('/')[0];
                          if (cityName === cityShortName) {
                            const final = province.label + '/' + city.label;
                            // console.log(final);
                            this.socketForm.patchValue({
                              city_shortname: final
                            });
                          }
                        });
                      }
                    });
                }
              }
            }
          }
        }
      },
      err => {
        this.isFetching = false;
      }
    );
  }

  submitForm(): void {
    if (this.socketForm.invalid) {
      for (const field in this.socketForm.controls) {
        if (this.socketForm.controls.hasOwnProperty(field)) {
          this.socketForm.controls[field].markAsDirty();
          this.socketForm.controls[field].updateValueAndValidity();
        }
      }
      return;
    }
    this.isSubmitting = true;
    const keys = Object.keys(this.socketForm.value);
    let postData;
    // console.log(this.socketForm.value);
    let cpc = this.socketForm.value.city_shortname;
    let mdt = this.socketForm.value.management_device_type;
    if (this.socketForm.value.city_shortname !== undefined) {
      mdt = this.socketForm.value.management_device_type.join();
    }
    if ((typeof this.socketForm.value.city_shortname) === 'object') {
      cpc = this.socketForm.value.city_shortname.join('/');
    } else {
      cpc = `${cpc}/${this.cityCode}`;
    }
    if (keys.length > 1) {
      postData = {
        ...this.socketForm.value,
        city_shortname: cpc,
        management_device_type: mdt,
        enable: this.socketForm.value.enable === true ? 'true' : 'false'
      };
    } else {
      postData = {
        enable: this.socketForm.value.enable === true ? 'true' : 'false',
        ip: null,
        management_device_type: null,
        omc_name: null,
        omc_no: null,
        port: null,
        province_city: null,
        pwd: null,
        type: null,
        user: null
      };
    }
    // console.log('postData', postData);
    this.http.post<{ code: number; data: any; errorMessage: string; message: string }>(apiUrl + 'setSocketConfig', postData).subscribe(
      res => {
        if (res.code === 1000) {
          this.message.success(this.translate.instant(this.sharedService.getSuccessMessage));
        }
        this.isSubmitting = false;
      },
      err => {
        this.isSubmitting = false;
      }
    );
  }

  clickStatus() {
    this.switchvalue = !this.switchvalue;
    if (this.switchvalue) {
      this.socketForm.enable();
    } else {
      this.socketForm.disable();
      this.socketForm.get('enable').enable();
    }
  }

  onFtpTypeChange(value) {
    if (value) {
      this.socketForm.patchValue({
        port: value === 'ftp' ? '21' : '22'
      });
    }
  }

  // onChanges(values: any): void {
  //   console.log(values);
  // }

}
