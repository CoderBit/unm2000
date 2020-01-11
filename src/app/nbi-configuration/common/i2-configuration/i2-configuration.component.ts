import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from '../../../../environments/environment';
import { SharedService } from 'src/app/shared/shared.service';
import { TranslateService } from '@ngx-translate/core';

const apiUrl = environment.API_URL + '/basic/xml/';

interface I2configuration {
  heartbeat_switch: string;
  port: string;
  ems_tmf_name: string;
}

@Component({
  selector: 'app-i2-configuration',
  templateUrl: './i2-configuration.component.html',
  styleUrls: ['./i2-configuration.component.scss']
})
export class I2ConfigurationComponent implements OnInit {

  i2commonForm: FormGroup;
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
  listOfControl: Array<{ id: number; controlInstance: string }> = [];

  panels = [{ active: true, disabled: false, title: this.translate.instant('Basic Configuration') }];

  ngOnInit(): void {
    this.i2commonForm = this.fb.group({
      socket: new FormControl(this.switchvalue),
      heartbeat_switch: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.sharedService.getAcceptOnlyNaturalNumbersValidation)
      ]),
      port: new FormControl({ value: '8086', disabled: true }),
      activemq_host: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.sharedService.getIpPatternValidation)
      ]),
      activemq_port: new FormControl({ value: '61616', disabled: true }),
      host: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.sharedService.getIpPatternValidation)
      ]),
      ems_tmf_name: new FormControl(null, [Validators.required, Validators.maxLength(20)])
    });
    this.fetchI2ConfigureData();
  }


  // clickStatus() {
  //   this.switchvalue = !this.switchvalue;
  //   if (this.switchvalue) {
  //     this.i2commonForm.patchValue({
  //       heartbeat_switch: null
  //     });
  //   }
  // }
  clickStatus() {
    this.switchvalue = !this.switchvalue;
    if (this.switchvalue) {
      // this.corbacommonForm.patchValue({
      //   heartbeat_switch: null
      // });
      if (this.i2commonForm.get('heartbeat_switch') !== null) {
        this.i2commonForm.get('heartbeat_switch').reset();
      }
    }
  }


  fetchI2ConfigureData() {
    this.isSpinning = true;
    const i2Config = [
      'host',
      'port',
      'heartbeat_switch',
      'ems_tmf_name',
      'activemq_host',
      'activemq_port',
    ];
    this.http.get<{ code: number; data: any; errorMessage: string; message: string }>(apiUrl + 'fetchXmlData/nbiConfig').subscribe(
      res => {
        // console.log('fetch-Corba-Data', res);
        if (res.code === 1000) {
          // console.log(res.data);
          const lists = res.data.xmlData.configlist.config;
          const i2Data = lists.find(
            data => data.name.toLocaleLowerCase() === 'i2'
          );
          // console.log('finding data from the api===', i2Data);
          for (const item of i2Data.ftpConfigOrTestfalgOrNativenameWithTypeFlag) {
            const isPresent = i2Config.includes(item.name);
            if (isPresent) {
              // console.log(item);
              this.i2commonForm.patchValue({
                [item.name]: item.value
              });
              // console.log(item.name);
              switch (item.name) {
                case 'heartbeat_switch':
                  this.switchvalue = item.value === '0' ? false : true;
                  this.i2commonForm.patchValue({
                    socket: this.switchvalue,
                  });
                  if (item.value === '0') {
                    this.i2commonForm.patchValue({
                      heartbeat_switch: '1'
                    });
                  }
                  break;
                  break;
              }
            }
          }
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
    if (this.i2commonForm.invalid) {
      for (const field in this.i2commonForm.controls) {
        if (this.i2commonForm.controls.hasOwnProperty(field)) {
          this.i2commonForm.controls[field].markAsDirty();
          this.i2commonForm.controls[field].updateValueAndValidity();
        }
      }
      return;
    }
    this.isLoading = true;
    const {
      host,
      port,
      heartbeat_switch,
      ems_tmf_name,
      activemq_host,
      activemq_port,
      socket
    } = this.i2commonForm.value;

    const sendData = {
      heartbeat_switch: socket === true ? heartbeat_switch : '0',
      host,
      port,
      ems_tmf_name,
      activemq_host,
      activemq_port,

    };
    this.http
      .post<{ code: number; data: any; errorMessage: string; message: string }>(
        apiUrl + 'updateI2File', sendData)
      .subscribe(
        res => {
          if (res.code === 1000) {
            this.message.success(this.translate.instant(this.sharedService.getSuccessMessage));
          }
          console.log('update the data==', res);
          this.isLoading = false;
        },
        err => {
          this.isLoading = false;
        }
      );


  }

}
