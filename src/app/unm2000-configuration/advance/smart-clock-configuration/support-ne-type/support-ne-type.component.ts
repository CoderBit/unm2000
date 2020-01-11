import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { TranslateService } from '@ngx-translate/core';

const apiUrl = environment.API_URL + '/advc/config/';

export interface Data {
  netypeno: string;
  nename: string;
  cnename: string;
  enename: string;
  Protocol: string;
  neclass: string;
  devicetype: string;
  uninetypeno: string;
  groupcode: string;
}

@Component({
  selector: 'app-support-ne-type',
  templateUrl: './support-ne-type.component.html',
  styleUrls: ['./support-ne-type.component.scss']
})
export class SupportNeTypeComponent implements OnInit {
  valuedata: string;
  langValue: string;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private modalService: NzModalService,
    private http: HttpClient,
    public translate: TranslateService,
    private sharedService: SharedService
  ) { this.sharedService.defaultLanguage().subscribe(
    res => {
      // console.log('default language==', res.data );
      // res.data = '1';
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
  searchData: any;
  searchForm: FormGroup;
  isAllDisplayDataChecked = true;
  isOperating = false;
  isIndeterminate = false;
  listOfDisplayPTNPots: Data[] = [];
  listOfAllDataPTSPotshtml = [];
  selectedDelete = [];
  selectedAdd = [];
  listOfAllModal = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  numberOfChecked = 0;
  isVisiblePtn = false;
  title: string;
  isSpinning = false;
  isModalSpinning = false;
  eventVariable: string;
  isCheckBoxDisabled = false;
  isCheckBoxDisabledModal = false;

  panels = [{ active: true, disabled: false, title: 'Support NE Type' }];
  nzChecked: any;
  values = '';

  temp = [];
  tempModal = [];


  isAllDisplayDataCheckedModal = false;
  // isOperating = false;
  isIndeterminateModal = false;
  listOfDisplayDataModal: Data[] = [];
  // listOfAllModal: Data[] = [];
  mapOfCheckedIdModal: { [key: string]: boolean } = {};
  numberOfCheckedModal = 0;

  @ViewChild('unitypenumber', { static: false }) unitypenumber: ElementRef;
  @ViewChild('enename', { static: false }) enename: ElementRef;

  currentPageDataChange($event: Data[]): void {
    this.listOfDisplayPTNPots = $event;
    this.refreshStatus();
    this.operateData();             //  this work for pagination refresh data for back.
  }



  searchFilter() {
    if (this.searchData !== '') {
      this.listOfAllDataPTSPotshtml = this.listOfAllDataPTSPotshtml.filter(res => {
        // return this.listOfAllDataPTSPotshtml.filter = this.searchData.trim().toLowerCase();
        return res.enename.toLocaleLowerCase().match(this.searchData.toLocaleLowerCase().trim()) +
          res.protocol.toLocaleLowerCase().match(this.searchData.toLocaleLowerCase().trim()) +
          res.devicetype.toLocaleLowerCase().match(this.searchData.toLocaleLowerCase().trim()) +
          res.neclass.toLocaleLowerCase().match(this.searchData.toLocaleLowerCase().trim()) +
          res.uninetypeno.match(this.searchData.trim());
      });

      // tslint:disable-next-line:quotemark
    } else if (this.searchData === "") {
      // console.log('blank');
      this.isCheckBoxDisabled = !this.isCheckBoxDisabled;
      //  console.log();
      this.isAllDisplayDataChecked = !this.isAllDisplayDataChecked;
      this.ngOnInit();
      // console.log('i m in seach');

    }


  }


  refreshStatus() {
    this.isAllDisplayDataChecked = this.listOfDisplayPTNPots.every(item => this.mapOfCheckedId[item.uninetypeno]);
    this.isIndeterminate = this.listOfDisplayPTNPots.some(item => this.mapOfCheckedId[item.uninetypeno]) && !this.isAllDisplayDataChecked;
    this.numberOfChecked = this.listOfAllDataPTSPotshtml.filter(item => this.mapOfCheckedId[item.uninetypeno]).length;
    if (this.listOfDisplayPTNPots.length !== 0) {
      this.isAllDisplayDataChecked = false;
    } else {
      this.isAllDisplayDataChecked = !this.isAllDisplayDataChecked;
      this.numberOfChecked = 0;
    }
  }



  checkAll(value: boolean): void {
    this.listOfDisplayPTNPots.forEach(item => (this.mapOfCheckedId[item.uninetypeno] = value));
    this.temp = this.listOfDisplayPTNPots.filter(item => (this.mapOfCheckedId[item.uninetypeno] === true));
    this.refreshStatus();
  }



  operateData(): void {
    this.isOperating = true;
    setTimeout(() => {
      this.listOfAllDataPTSPotshtml.forEach(item => (this.mapOfCheckedId[item.uninetypeno] = false));
      this.refreshStatus();
      this.isOperating = false;
    }, 0);
  }



  selectSomeData(data: any) {
    this.temp = this.listOfDisplayPTNPots.filter(item => (this.mapOfCheckedId[item.uninetypeno] === true));
  }

  // Below Modal check box coding

  selectSomeDataModal(data: any) {
    this.tempModal = this.listOfDisplayDataModal.filter(item => (this.mapOfCheckedIdModal[item.uninetypeno] === true));

  }


  currentPageDataChangeModal($event: Data[]): void {
    this.listOfDisplayDataModal = $event;
    this.refreshStatusModal();
    this.operateDataModal();
  }

  refreshStatusModal(): void {
    if (this.listOfDisplayDataModal.length !== 0) {
      this.isAllDisplayDataCheckedModal = this.listOfDisplayDataModal
        .every(item => this.mapOfCheckedIdModal[item.uninetypeno]);
      this.isIndeterminateModal =
        this.listOfDisplayDataModal.some(item => this.mapOfCheckedIdModal[item.uninetypeno]) &&
        !this.isAllDisplayDataCheckedModal;
      this.numberOfCheckedModal = this.listOfAllModal.filter(item => this.mapOfCheckedIdModal[item.uninetypeno]).length;
      // console.log('i m here first resrresh modal');
      this.isCheckBoxDisabledModal = false;
    } else {
      this.isCheckBoxDisabledModal = true;

    }
  }

  checkAllModal(value: boolean): void {
    this.listOfDisplayDataModal.forEach(item => (this.mapOfCheckedIdModal[item.uninetypeno] = value));
    this.tempModal = this.listOfDisplayDataModal.filter(item => (this.mapOfCheckedIdModal[item.uninetypeno] === true));
    this.refreshStatusModal();
  }

  operateDataModal(): void {
    this.isOperating = true;
    setTimeout(() => {
      this.listOfAllModal.forEach(item => (this.mapOfCheckedIdModal[item.uninetypeno] = false));
      this.refreshStatusModal();
      this.isOperating = false;
    }, 0);
  }




  showDeleteConfirm(): void {
    this.modalService.confirm({
      nzTitle: this.translate.instant('confirm_delete_msg'),
      nzOkText: this.translate.instant('confirm_yes'),
      nzOnOk: () => this.deleteSuportNe(),
      nzCancelText: this.translate.instant('confirm_no'),
      nzOnCancel: () => this.onCancleClearList(),
    });
  }

  onCancleClearList() {
    // console.log('below cancel');
    this.selectedDelete = [];
    this.selectedAdd = [];
    this.isCheckBoxDisabledModal = false;
    // this.searchForm.value.btntype = '';
    // this.searchForm.value.uniNeTypeNumber = '';
    // this.searchForm.value.eneName = '';
    // this.unitypenumber.nativeElement.value = '';
    // this.enename.nativeElement.value = '';
    this.resetForm();
  }

  deleteSuportNe() {
    this.isSpinning = true;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.temp.length; i++) {
      this.selectedDelete.push({
        uninetypeno: this.temp[i].uninetypeno,
        devicetype: this.temp[i].devicetype,
      });
    }
    this.http
      .post<{ code: number, data: any, errorMessage: string, msg: string }>(apiUrl + 'deleteOtnPtnDevice', this.selectedDelete)
      .subscribe(
        res => {
          if (res.code === 1000) {
            this.getFeatchData();
            this.temp = [];
            this.selectedDelete = [];
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

  handleAdd() {
    if (this.numberOfCheckedModal !== 0) {
      this.isSpinning = true;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.tempModal.length; i++) {
        this.selectedAdd.push({
          uninetypeno: this.tempModal[i].uninetypeno,

        });
      }

      // console.table(this.eventVariable + '' + this.numberOfCheckedModal);
      this.http
        .post<{ code: number, data: any, errorMessage: string, msg: string }>(apiUrl
          + 'saveOtnPtnDevice/' + this.eventVariable, this.selectedAdd)
        .subscribe(
          res => {
            if (res.code === 1000) {
              this.getFeatchData();
              this.tempModal = [];
              this.selectedAdd = [];

              // this.message.success();
              this.message.success(this.translate.instant(this.eventVariable + ' ' + this.sharedService.getSuccessMessage));
              this.resetForm();
              setTimeout(() => {
                this.isSpinning = false;
                this.isVisiblePtn = false;
              }, 1000);
              this.numberOfCheckedModal = 0;
            }

          },
          err => {
            this.isSpinning = false;
            this.message.error(this.eventVariable + 'failed');
            this.isVisiblePtn = false;
          }
        );

    } else {
      this.message.info(this.translate.instant('plz_select_any_one'));
      this.tempModal = [];
    }
  }

  handleCancelTop(): void {
    console.log(this.unitypenumber);
    this.resetForm();
    this.searchForm.value.btntype = '';
    this.searchForm.value.uniNeTypeNumber = '';
    this.searchForm.value.eneName = '';
    this.selectedAdd = [];
    this.isVisiblePtn = false;
    this.isCheckBoxDisabledModal = false;
    this.unitypenumber.nativeElement.value = '';
    this.enename.nativeElement.value = '';
  }



  showAddModalPtn(event: any): void {
    this.isModalSpinning = true;
    this.eventVariable = event;
    this.title = this.translate.instant('add_ptn_support_ne_type');
    this.searchForm.patchValue({
      btntype: this.eventVariable
    });
    this.http
      .get<{ code: number, data: any, errorMessage: string, msg: string }>(apiUrl + 'getAllPtnPots?ptn' + '&uniNeTypeNumber=&eneName=')
      .subscribe(
        res => {
          if (res.code === 1000 && res.data.staticDataType.length !== 0) {
            this.isAllDisplayDataCheckedModal = true;
            this.isCheckBoxDisabledModal = this.isCheckBoxDisabledModal;
            this.listOfAllModal = res.data.staticDataType;
            setTimeout(() => {
              this.isModalSpinning = false;
            }, 1500);

          } else {
            this.isAllDisplayDataCheckedModal = false;
            this.isCheckBoxDisabledModal = !this.isCheckBoxDisabledModal;
            this.listOfAllModal = res.data.staticDataType;
            this.isModalSpinning = false;

          }

        }
      );
    this.isVisiblePtn = true;
  }


  showAddModalPots(event: any): void {
    this.eventVariable = event;
    this.isModalSpinning = true;
    this.title = this.translate.instant('add_support_pots_ne_type');
    this.searchForm.patchValue({
      btntype: this.eventVariable
    });
    this.http
      .get<{ code: number, data: any, errorMessage: string, msg: string }>(apiUrl + 'getAllPtnPots?pots' + '&uniNeTypeNumber=&eneName=')
      .subscribe(
        res => {
          if (res.code === 1000 && res.data.staticDataType.length !== 0) {
            this.isAllDisplayDataCheckedModal = true;
            this.isCheckBoxDisabledModal = this.isCheckBoxDisabledModal;
            this.listOfAllModal = res.data.staticDataType;
            setTimeout(() => {
              this.isModalSpinning = false;
            }, 1500);
          } else {
            this.isAllDisplayDataCheckedModal = false;
            this.isCheckBoxDisabledModal = !this.isCheckBoxDisabledModal;
            this.listOfAllModal = res.data.staticDataType;
            this.isModalSpinning = false;
          }

        }
      );
    this.isVisiblePtn = true;

  }

  submitSearch(): void {
    this.isModalSpinning = true;
    this.listOfAllModal = [];

    this.http
      .get<{ code: number, data: any, errorMessage: string, msg: string }>(apiUrl + 'getAllPtnPots?' +
        this.searchForm.value.btntype + '&uniNeTypeNumber=' + this.searchForm.value.uniNeTypeNumber.trim() + '&eneName='
        + this.searchForm.value.eneName.trim())
      .subscribe(
        res => {
          if (res.code === 1000) {
            console.log(res.data);
            this.listOfAllModal = res.data.staticDataType;
            console.log(this.listOfAllModal.length);
            setTimeout(() => {
              this.isModalSpinning = false;
            }, 1500);
          } else {
            this.onCancleClearList();
          }

        }
      );
  }

  resetForm(): void {
    this.searchForm.patchValue({
      btntype: '',
      uniNeTypeNumber: '',
      eneName : ''
    });
  }


  ngOnInit() {
    this.searchForm = this.fb.group({
      btntype: new FormControl(''),
      uniNeTypeNumber: new FormControl(''),
      eneName: new FormControl(''),
    });
    this.getFeatchData();
  }


  getFeatchData() {
    this.isSpinning = true;
    this.http
      .get<{ code: number, data: any, errorMessage: string, msg: string }>(apiUrl + 'getSupportNeType')
      .subscribe(
        res => {
          if (res.code === 1000 && res.data.length !== 0) {
            this.listOfAllDataPTSPotshtml = res.data;
            this.isCheckBoxDisabled = false;
            setTimeout(() => {
              this.isSpinning = false;
            }, 1000);
          } else {
            this.isCheckBoxDisabled = !this.isCheckBoxDisabled;
            this.isAllDisplayDataChecked = !this.isAllDisplayDataChecked;
            this.isSpinning = false;
            this.listOfAllDataPTSPotshtml = res.data;
          }
        },
        err => {
          this.isCheckBoxDisabled = true;
          this.isSpinning = false;
        }
      );
  }

}
