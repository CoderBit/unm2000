import { Component, OnInit, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from '../../../environments/environment';
import { SharedService } from 'src/app/shared/shared.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/login/auth.service';
const apiUrl = environment.API_URL + '/configurationlogs/';
const rollBack = environment.API_URL + '/log/rollBack/';
import { TranslateService } from '@ngx-translate/core';
const exportUrl = environment.API_URL + '/configurationlogs/';



declare var require: any;



export interface Data {
  operationTime: any;
  userName: string;
  operationResult: string;
  oldValue: string;
  newValue: string;
  optionName: string;
  moduleName: string;
  sectionName: string;
  subSectionName: string;
  logType: string;
  logId: number;
  emptyAndNull: string;
  modifiedOldValue: string;
  modifiedNewValue: string;
  disabled?: boolean;
}


@Injectable()
export class RandomUserService {


  getUsers(pageIndex: number = 1, pageSize: number = 10): Observable<any> {
    const params = new HttpParams()
      .append('page', `${pageIndex}`)
      .append('rows', `${pageSize}`);
    // console.log('get user');
    return this.http.get<{ code: number, data: any, errorMessage: string, msg: string; totalData: number }>
      (apiUrl + `getConfigurationLogs?`, {
        params
      });
  }

  constructor(private http: HttpClient) { }
}

@Component({
  providers: [RandomUserService],
  selector: 'app-log-configuration',
  templateUrl: './log-configuration.component.html',
  styleUrls: ['./log-configuration.component.scss']
})

export class LogConfigurationComponent implements OnInit {
  isSpinning = false;
  username = 'admin';
  isAllDisplayDataChecked = false;
  isOperating = false;
  isIndeterminate = false;
  listOfDisplayData: Data[] = [];
  listOfAllData: Data[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  numberOfChecked = 0;
  pageTotal: string;
  pageIndex = 1;
  pageSize = 10;
  totalList: Data[] = [];
  selectedData = [];
  total = 1;
  index = 0;
  tabs = ['Common Configuration'];
  loadTabContent = 'Common Configuration';
  temp = require('src/assets/json/log.json');
  panels;
  seletedDataExport = [];
  checkboxDisable = true;
  disabledSatus = false;

  checkBoxClick = [];

  loading = true;
  langValue: string;
  checkedCount: number;
  isCheckBoxDisabled = false;
  constructor(
    private titleService: Title,
    private http: HttpClient,
    private randomUserService: RandomUserService,
    private message: NzMessageService,
    private authService: AuthService,
    private sharedService: SharedService,
    public translate: TranslateService
  ) {
    this.sharedService.defaultLanguage().subscribe(
      res => {
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

  ngOnInit(): void {
    this.username = this.authService.currentUser !== null ? this.authService.currentUser : 'admin';
    this.titleService.setTitle('Configuration log');
    this.panels = this.temp.panels;
    this.getLogData();
  }




  changeLogParameters(data: any, value) {
    let val = null;
    if (data.moduleName === 'NBI Configuration') {
      switch (data.sectionName) {
        case 'Common Configuration':
          if (data.optionName === 'Get LayerParameters From Device') {
            val = value === 'false' ? 'False' : 'True';
          } else if (data.optionName === 'Native Name With Type Flag') {
            val = value === '0' ? 'False' : 'True';
          } else if (data.optionName === 'Port Display Mode') {
            val = value === '0' ? 'Protocol Name' : value === '1' ? 'Physical Name' : 'Physical & Protocol Name';
          } else if (data.optionName === 'Read Slot State From Device') {
            val = value === '0' ? 'False' : 'True';
          } else if (data.optionName === 'Compress Type') {
            val = value === '0' ? 'ZIP' : 'GZIP';
          } else {
            val = value;
          }
          break;

        case 'Corba Configuration':
          if (data.optionName === 'HeartBeat Switch') {
            val = value === '0' ? 'Disable' : 'Enable';
          } else if (data.optionName === 'NBI Protocol Version') {
            val = value === '0' ? 'MTNM3.5' : 'CMCC';
          } else if (data.optionName === 'Project Alarm Filter Switch') {
            val = value === '0' ? 'Enable' : 'Disable';
          } else if (data.optionName === 'Bussiness Type') {
            val = value === '0' ? 'UNM2000 Model' : 'OTNM2000 Model';
          } else {
            val = value;
          }
          break;
        case 'I2 Configuration':
          if (data.optionName === 'HeartBeat Switch') {
            val = value === '0' ? 'Disable' : 'Enable';
          } else {
            val = value;
          }
          break;
        case 'Socket Configuration':
          if (data.optionName === 'Socket Interface Switch') {
            val = value === 'false' ? 'Disable' : 'Enable';
          } else {
            val  = value.substring(0, value.lastIndexOf('/') + 0);
            // // val = value.substring(value.lastIndexOf('/') + 6, value.length);
            // console.log(val);
            // // console.log(last);
            // // val = value.lastIndexOf('/').
            // // split('0').join('')
            // // .split('1').join('').split('2')
            // // .join('').split('3')
            // // .join('').split('4')
            // // .join('').split('5')
            // // .join('').split('6')
            // // .join('').split('7').join('').split('8').join('').split('9').join('');
            // // console.log(val)
          }
          break;

        default:
          // console.log('default');
          val = value;
      }
      // console.log('nbi configuration')
    } else if (data.moduleName === 'UNM2000') {
      switch (data.sectionName) {
        case 'Common Configuration':
          val = value === 'false' ? 'Disable' : 'Enable';
          break;
        case 'Performance Configuration':
          if (data.optionName === 'Performance Simulation Test Switch') {
            val = value === 'false' ? 'Disable' : 'Enable';
          } else if (data.optionName === 'Export Save Max. No. Of Days') {
            val = value;
          } else {
            val = value === 'false' ? 'False' : 'True';
          }
          break;
        case 'Ason Configuration':
          if (data.optionName === 'Ason Simulator Switch') {
            val = value === '0' ? 'Disable' : 'Enable';
          } else {
            val = value === 'false' ? 'Disable' : 'Enable';
          }
          break;
        case 'Alarm Configuration':
          if (data.optionName === 'Alarm Automatic  Aynchronization  Interval') {
            val = value;
          } else if (data.optionName === 'Alarm Automatic  Syncronization Switch') {
            val = value === '0' ? 'Disable' : 'Enable';
          } else {
            val = value === 'false' ? 'Disable' : 'Enable';
          }
          break;
        case 'Telemetry Configuration':
          if (data.optionName === 'Telemetry UDP Switch') {
            val = value === 'false' ? 'Disable' : 'Enable';
          } else {
            val = value;
          }
          break;
        case 'Business Configuration':
          if (data.optionName === 'Single NE Service Switch') {
            val = value === 'false' ? 'Disable' : 'Enable';
          }
          break;
        case 'PON Product Configuration':
          if (data.optionName === 'Pon Flow Function Switch') {
            val = value === 'false' ? 'Disable' : 'Enable';
          } else if (data.optionName === 'Display Board Version') {
            val = value === 'false' ? 'False' : 'True';
          } else if (data.optionName === 'Onu Name Check') {
            val = value === 'false' ? 'Disable' : 'Enable';
          } else if (data.optionName === 'Onu FriendName Check') {
            val = value === 'false' ? 'Disable' : 'Enable';
          } else if (data.optionName === 'Onu Mac Check') {
            val = value === 'false' ? 'Disable' : 'Enable';
          } else {
            val = value;
          }
          break;
        case 'SimulationTest Configuration':
          if (data.optionName === 'Simulation Test Switch') {
            val = value === 'false' ? 'Disable' : 'Enable';
          }
          break;

        default:
          // console.log('default');
          val = value;
      }
    }
    return val;
  }

  originalValue(valueOrg: any, moduleName: any) {
    let originalValue = null;
    if (moduleName === 'Display Board Version') {
      if (valueOrg === 'false') {
        valueOrg === 'false' ? originalValue = 'false' : originalValue = 'true';
      }
    }
    if (valueOrg === 'Disable') {
      moduleName === 'Get LayerParameters From Device' ? originalValue = 'false' : originalValue = 'false';
    } else if (valueOrg === 'Enable') {
      moduleName === 'Get LayerParameters From Device' ? originalValue = 'true' : originalValue = 'true';
    } else if (valueOrg === 'Enable') {
      moduleName === 'SUB SELF SWITCH' ? originalValue = 'true' : originalValue = 'true';
    } else if (valueOrg === 'Disable') {
      moduleName === 'SUB SELF SWITCH' ? originalValue = 'false' : originalValue = 'false';
    } else if (valueOrg === 'Protocol Name') {
      moduleName === 'Port Display Mode' ? originalValue = '0' : originalValue = '0';
    } else if (valueOrg === 'Physical Name') {
      moduleName === 'Port Display Mode' ? originalValue = '1' : originalValue = '1';
    } else if (valueOrg === 'Physical & Protocol Name') {
      moduleName === 'Port Display Mode' ? originalValue = '2' : originalValue = '2';
    } else if (valueOrg === 'Disable') {
      moduleName === 'EMS STATUS SWITCH' ? originalValue = 'false' : originalValue = 'false';
    } else if (valueOrg === 'Enable') {
      moduleName === 'EMS STATUS SWITCH' ? originalValue = 'true' : originalValue = 'true';
    } else if (valueOrg === 'True') {
      moduleName === 'Read Slot State From Device' ? originalValue = '1' : originalValue = '1';
    } else if (valueOrg === 'False') {
      moduleName === 'Read Slot State From Device' ? originalValue = '0' : originalValue = '0';
    } else if (valueOrg === '0') {
      moduleName === 'Compress Type' ? originalValue = '0' : originalValue = '0';
    } else if (valueOrg === '1') {
      moduleName === 'Compress Type' ? originalValue = '1' : originalValue = '1';
    } else {
      originalValue = valueOrg;
    }
    return originalValue;

  }



  getLogData(reset: boolean = false): void {
    // console.log(reset);
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    console.log(apiUrl + 'getConfigurationLogs?page=' + this.pageIndex + '&rows=' + this.pageSize);
    this.randomUserService
      .getUsers(this.pageIndex, this.pageSize)
      .subscribe(res => {
        this.loading = false;
        this.total = res.totalData;
        console.log('response', res);
        this.listOfAllData = [];
        this.totalList = [];
        for (let i = 0; i < res.data.length; i++) {
          this.totalList.push({
            operationTime: res.data[i].operationTime,
            userName: res.data[i].userName,
            operationResult: res.data[i].operationResult,
            modifiedOldValue: this.changeLogParameters(res.data[i], res.data[i].oldValue),
            modifiedNewValue: this.changeLogParameters(res.data[i], res.data[i].newValue),
            optionName: res.data[i].optionName,
            moduleName: res.data[i].moduleName,
            sectionName: res.data[i].sectionName,
            subSectionName: res.data[i].subSectionName,
            logType: res.data[i].logType,
            logId: i,
            emptyAndNull: res.data[i].oldValue,
            oldValue: res.data[i].oldValue,
            newValue: res.data[i].newValue,
          });
        }
        this.listOfAllData = this.totalList;
      });
  }

  rollBackApi() {
    if (this.checkedCount > 1) {
      this.message.info(this.translate.instant('plz_select_any_one'));

    } else {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.checkBoxClick.length; i++) {
        this.selectedData.push({
          operationTime: this.checkBoxClick[0].operationTime,
          userName: this.checkBoxClick[0].userName,
          operationResult: this.checkBoxClick[0].operationResult,
          oldValue: this.originalValue(this.checkBoxClick[0].oldValue, this.checkBoxClick[0].optionName),
          newValue: this.originalValue(this.checkBoxClick[0].newValue, this.checkBoxClick[0].optionName),
          optionName: this.checkBoxClick[0].optionName,
          moduleName: this.checkBoxClick[0].moduleName,
          sectionName: this.checkBoxClick[0].sectionName,
          subSectionName: this.checkBoxClick[0].subSectionName
        });
      }

      this.http
        .post<{ code: number, data: any, errorMessage: string, msg: string }>(rollBack + 'rollBackLog', this.selectedData[0])
        .subscribe(
          res => {
            if (res.code === 1000) {
              this.message.success(this.translate.instant('roll_sucess'));
              this.operateData();
              this.selectedData = [];
              this.checkedCount = 0;
              this.getLogData();
            } else {
              this.operateData();
              this.selectedData = [];
              this.getLogData();
            }
          },
          err => {
            // console.log('i m here in fail condition');
            this.operateData();
            this.selectedData = [];
          }
        );
    }
    // this.ngOnInit();
  }

  exportLog() {
    if (this.numberOfChecked > 0) {
      this.seletedDataExport = this.checkBoxClick;

    } else {
      this.seletedDataExport = [{}];
    }
    // console.log('send value=', this.checkBoxClick );
    this.http
      .post<{ code: number, data: any, errorMessage: string, msg: string }>
      (exportUrl + 'exportLog', this.seletedDataExport)
      .subscribe(
        res => {
          console.log(res);
          if (res.code === 1000) {
            const datasend = exportUrl + 'file';
            window.open(datasend, '_blank');
            this.operateData();
          } else {
            this.operateData();
            this.seletedDataExport = [];
          }
        },
        err => {
          // console.log('i m here in fail condition');
          this.operateData();

        }
      );
    // this.message.warning('unger progress');
  }

  currentPageDataChange($event: Data[]): void {
    this.listOfDisplayData = $event;
    this.refreshStatus();
    this.operateData();
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => this.mapOfCheckedId[item.logId]);
    this.isIndeterminate = this.listOfDisplayData.some(item => this.mapOfCheckedId[item.logId]) && !this.isAllDisplayDataChecked;
    this.numberOfChecked = this.listOfAllData.filter(item => this.mapOfCheckedId[item.logId]).length;
    if (this.listOfDisplayData.length !== 0) {
      // this.isAllDisplayDataChecked = false;
      this.checkboxDisable = false;

    } else {
      this.isAllDisplayDataChecked = !this.isAllDisplayDataChecked;
      this.numberOfChecked = 0;
      this.isCheckBoxDisabled = !this.isCheckBoxDisabled;
      this.checkboxDisable = true;

    }


  }

  checkAll(value: boolean): void {
    this.listOfDisplayData.forEach(item => (this.mapOfCheckedId[item.logId] = value));
    this.checkBoxClick = this.listOfDisplayData.filter(item => (this.mapOfCheckedId[item.logId] === true));
    console.log('check all=', this.checkBoxClick);
    // console.log('numberOfChecked' , this.numberOfChecked);
    this.checkedCount = this.checkBoxClick.length;
    this.refreshStatus();
  }
  selectSomeData(data: any): void {
    this.checkBoxClick = this.listOfDisplayData.filter(item => (this.mapOfCheckedId[item.logId] === true));
    this.checkedCount = this.checkBoxClick.length;
    this.refreshStatus();
  }

  operateData(): void {
    this.isOperating = true;
    setTimeout(() => {
      this.listOfAllData.forEach(item => (this.mapOfCheckedId[item.logId] = false));
      this.refreshStatus();
      this.isOperating = false;
    }, 0);
  }


}
