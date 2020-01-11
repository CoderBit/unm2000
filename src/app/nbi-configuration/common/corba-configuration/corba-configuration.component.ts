import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from '../../../../environments/environment';
import { SharedService } from 'src/app/shared/shared.service';
import { TranslateService } from '@ngx-translate/core';

const apiUrl = environment.API_URL + '/basic/xml/';

interface Response {
  code: number;
  data: any;
  errorMessage: string;
  message: string;
  totalData: string;
}

@Component({
  selector: 'app-corba-configuration',
  templateUrl: './corba-configuration.component.html',
  styleUrls: ['./corba-configuration.component.scss']
})
export class CorbaConfigurationComponent implements OnInit {
  corbacommonForm: FormGroup;
  switchvalue = false;
  isLoading = false;
  isSpinning = false;
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
        console.log('default language==', res.data);
        switch (res.data) {
          case '0':
            this.langValue = 'en';
            break;
          case '1':
            this.langValue = 'ch';
            break;
          default:
        }
        console.log('default value language==', this.langValue);
        translate.addLangs(['en', 'ch']);
        translate.setDefaultLang(this.langValue);
        const browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|ch/) ? this.langValue : 'ch');
      }
    );
  }

  listOfControl: Array<{ id: number; controlInstance: string }> = [];

  ngOnInit(): void {
    this.corbacommonForm = this.fb.group({
      socket: new FormControl(this.switchvalue),
      heartbeat_switch: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.sharedService.getAcceptOnlyNaturalNumbersValidation)
      ]),
      host: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.sharedService.getIpPatternValidation)
      ]),
      port: new FormControl({ value: '8086', disabled: true }),
      ems_tmf_name: new FormControl(null, [Validators.required]),
      nbiprotocolversion: new FormControl(null, [Validators.required]),
      alarm_project_state: new FormControl(null),
      bussiness_type: new FormControl(null, [Validators.required])
    });

    this.fetchData();
  }

  clickStatus() {
    this.switchvalue = !this.switchvalue;
    if (this.switchvalue) {
      // this.corbacommonForm.patchValue({
      //   heartbeat_switch: null
      // });
      if (this.corbacommonForm.get('heartbeat_switch') !== null) {
        this.corbacommonForm.get('heartbeat_switch').reset();
      }
    }
  }

  submitForm(): void {
    // console.log(this.corbacommonForm.value);
    if (this.corbacommonForm.invalid) {
      for (const field in this.corbacommonForm.controls) {
        if (this.corbacommonForm.controls.hasOwnProperty(field)) {
          this.corbacommonForm.controls[field].markAsDirty();
          this.corbacommonForm.controls[field].updateValueAndValidity();
        }
      }
      return;
    }
    this.isLoading = true;
    // console.log(this.corbacommonForm.value);
    const {
      heartbeat_switch,
      host,
      ems_tmf_name,
      nbiprotocolversion,
      alarm_project_state,
      bussiness_type,
      socket
    } = this.corbacommonForm.value;
    const sendData = {
      heartbeat_switch: socket === true ? heartbeat_switch : '0',
      host,
      ems_tmf_name,
      nbi_protocol_version: nbiprotocolversion,
      alarm_project_state: alarm_project_state === true ? '0' : '1',
      business_type: bussiness_type
    };
    console.log(sendData);
    this.http.post<Response>(apiUrl + 'setCorbraConfig', sendData)
      .subscribe(
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
    const corbaConfig = [
      'host',
      'port',
      'heartbeat_switch',
      'ems_tmf_name',
      'nbiprotocolversion',
      'alarm_project_state',
      'bussiness_type'
    ];
    this.http.get<Response>(apiUrl + 'fetchXmlData/nbiConfig').subscribe(
      res => {
        setTimeout(() => {
          this.isSpinning = false;
        }, 1000);
        if (res.code === 1000) {
          const lists = res.data.xmlData.configlist.config;
          const corbaData = lists.find(
            data => data.name.toLocaleLowerCase() === 'corba'
          );
          for (const item of corbaData.ftpConfigOrTestfalgOrNativenameWithTypeFlag) {
            const isPresent = corbaConfig.includes(item.name);
            if (isPresent) {
              this.corbacommonForm.patchValue({
                [item.name]: item.value
              });
              switch (item.name) {
                case 'heartbeat_switch':
                  this.switchvalue = item.value === '0' ? false : true;
                  this.corbacommonForm.patchValue({
                    socket: this.switchvalue
                  });
                  if (item.value === '0') {
                    this.corbacommonForm.patchValue({
                      heartbeat_switch: '1'
                    });
                  }
                  break;
                case 'alarm_project_state':
                  this.corbacommonForm.patchValue({
                    alarm_project_state: item.value === '1' ? false : true
                  });
                  break;
                case 'nbiprotocolversion':
                  const nbiValue = item.value === '0' ? '0' : item.value === '1' ? '1' : null;
                  this.corbacommonForm.patchValue({
                    nbiprotocolversion: nbiValue
                  });
                  break;
                case 'bussiness_type':
                  const businessTypeValue = item.value === '0' ? '0' : item.value === '1' ? '1' : null;
                  this.corbacommonForm.patchValue({
                    bussiness_type: businessTypeValue
                  });
                  break;
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
}
