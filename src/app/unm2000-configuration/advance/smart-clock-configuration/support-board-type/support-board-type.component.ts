import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { TranslateService } from '@ngx-translate/core';
const apiUrl = environment.API_URL + '/boardType/xml/';
export interface Data {
  features: string;
  boardType: string;
  unicol: string;
  boardcode: string;
  devicetype: string;
  boardclass: string;
  groupcode: string;
  boardname: string;
}

@Component({
  selector: 'app-support-board-type',
  templateUrl: './support-board-type.component.html',
  styleUrls: ['./support-board-type.component.scss']
})

export class SupportBoardTypeComponent implements OnInit {
  langValue: string;
  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private modalService: NzModalService,
    private http: HttpClient,
    public translate: TranslateService,
    private sharedService: SharedService
  ) {
    this.sharedService.defaultLanguage().subscribe(
      res => {
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
        translate.addLangs(['en', 'ch']);
        translate.setDefaultLang(this.langValue);
        const browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|ch/) ? this.langValue : 'ch');
      }
    );
   }

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

  panels = [{ active: true, disabled: false, title: 'Support Board Type' }];
  nzChecked: any;
  values = '';
  searchData: any;

  temp = [];
  tempModal = [];


  isAllDisplayDataCheckedModal = false;
  // isOperating = false;
  isIndeterminateModal = false;
  listOfDisplayDataModal: Data[] = [];
  // listOfAllModal: Data[] = [];
  mapOfCheckedIdModal: { [key: string]: boolean } = {};
  numberOfCheckedModal = 0;

  @ViewChild('unical', { static: false }) unical: ElementRef;
  @ViewChild('boardname', { static: false }) boardname: ElementRef;

  currentPageDataChange($event: Data[]): void {
    this.listOfDisplayPTNPots = $event;
    this.refreshStatus();
    this.operateData();             //  this work for pagination refresh data for back.
  }



  searchFilter() {
    if ( this.searchData !== '') {
        this.listOfAllDataPTSPotshtml = this.listOfAllDataPTSPotshtml.filter(res => {
       // return this.listOfAllDataPTSPotshtml.filter = this.searchData.trim().toLowerCase();
       return res.unicol.toLocaleLowerCase().match(this.searchData.toLocaleLowerCase().trim()) +
        res.boardname.toLocaleLowerCase().match(this.searchData.toLocaleLowerCase().trim()) +
        res.boardclass.toLocaleLowerCase().match(this.searchData.toLocaleLowerCase().trim());
     });
     // tslint:disable-next-line:quotemark
     } else if (this.searchData === "") {
           // console.log('blank');
          this.isCheckBoxDisabled = !this.isCheckBoxDisabled;
          //  console.log();
          this.isAllDisplayDataChecked = !this.isAllDisplayDataChecked;
          this.ngOnInit();
     }
    }


  refreshStatus() {
    if (this.listOfDisplayPTNPots.length !== 0) {
      this.isAllDisplayDataChecked = this.listOfDisplayPTNPots.every(item => this.mapOfCheckedId[item.unicol]);
      console.log(this.listOfDisplayPTNPots);
      this.listOfDisplayPTNPots.some(item => console.log(item));
      this.isIndeterminate = this.listOfDisplayPTNPots.some(item => this.mapOfCheckedId[item.unicol]) && !this.isAllDisplayDataChecked;
      this.numberOfChecked = this.listOfAllDataPTSPotshtml.filter(item => this.mapOfCheckedId[item.unicol]).length;
    } else {
      this.isAllDisplayDataChecked = !this.isAllDisplayDataChecked;
      this.numberOfChecked = 0;
    }
  }



  checkAll(value: boolean): void {
    this.listOfDisplayPTNPots.forEach(item => (this.mapOfCheckedId[item.unicol] = value));
    this.temp = this.listOfDisplayPTNPots.filter(item => (this.mapOfCheckedId[item.unicol] === true));
    this.refreshStatus();
  }



  operateData(): void {
    this.isOperating = true;
    setTimeout(() => {
      this.listOfAllDataPTSPotshtml.forEach(item => (this.mapOfCheckedId[item.unicol] = false));
      this.refreshStatus();
      this.isOperating = false;
    }, 0);
  }



  selectSomeData(data: any) {
    this.temp = this.listOfDisplayPTNPots.filter(item => (this.mapOfCheckedId[item.unicol] === true));
  }

  // Below Modal check box coding

  selectSomeDataModal(data: any) {
    this.tempModal = this.listOfDisplayDataModal.filter(item => (this.mapOfCheckedIdModal[item.unicol] === true));

  }


  currentPageDataChangeModal($event: Data[]): void {
    this.listOfDisplayDataModal = $event;
    this.refreshStatusModal();
    this.operateDataModal();
  }

  refreshStatusModal(): void {
    if (this.listOfDisplayDataModal.length !== 0) {
      this.isAllDisplayDataCheckedModal = this.listOfDisplayDataModal
        .every(item => this.mapOfCheckedIdModal[item.unicol]);
      this.isIndeterminateModal =
        this.listOfDisplayDataModal.some(item => this.mapOfCheckedIdModal[item.unicol]) &&
        !this.isAllDisplayDataCheckedModal;
      this.numberOfCheckedModal = this.listOfAllModal.filter(item => this.mapOfCheckedIdModal[item.unicol]).length;
      this.isCheckBoxDisabledModal = false;
    } else {
     this.isCheckBoxDisabledModal = true;
    }
  }

  checkAllModal(value: boolean): void {
    this.listOfDisplayDataModal.forEach(item => (this.mapOfCheckedIdModal[item.unicol] = value));
    this.tempModal = this.listOfDisplayDataModal.filter(item => (this.mapOfCheckedIdModal[item.unicol] === true));
    this.refreshStatusModal();
  }

  operateDataModal(): void {
    this.isOperating = true;
    setTimeout(() => {
      this.listOfAllModal.forEach(item => (this.mapOfCheckedIdModal[item.unicol] = false));
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
    this.selectedDelete = [];
    this.selectedAdd = [];
    this.isCheckBoxDisabledModal = false;
  }

  deleteSuportNe() {
    this.isSpinning = true;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.temp.length; i++) {
      this.selectedDelete.push({
        uniCol: this.temp[i].unicol,
        deviceType: this.temp[i].devicetype,
      });
    }
    this.http
      .post<{ code: number, data: any, errorMessage: string, msg: string }>(apiUrl + 'deleteBoardDevice', this.selectedDelete)
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
          uniCol: this.tempModal[i].unicol,

        });
      }
      this.http
        .post<{ code: number, data: any, errorMessage: string, msg: string }>(apiUrl
          + 'saveBoardType/board/', this.selectedAdd)
        .subscribe(
          res => {
            if (res.code === 1000) {
              this.getFeatchData();
              this.tempModal = [];
              this.selectedAdd = [];
              this.message.success(this.translate.instant(this.sharedService.getSuccessMessage));
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
            this.message.error(this.translate.instant(this.eventVariable + ' update failed'));
            this.isVisiblePtn = false;
          }
        );

    } else {
      this.message.info(this.translate.instant('plz_select_any_one'));
      this.tempModal = [];
    }
  }

  handleCancelTop(): void {
    this.unical.nativeElement.value = '';
    this.boardname.nativeElement.value = '';
    this.selectedAdd = [];
    this.isVisiblePtn = false;
    this.isCheckBoxDisabledModal = false;
    this.resetForm();
  }



  showAddModalPtn(): void {
    this.isModalSpinning = true;
    // this.eventVariable = event;
    this.title = this.translate.instant('add_support_board_type');

    this.http
      .get<{ code: number, data: any, errorMessage: string, msg: string }>(apiUrl + 'getAllBoardType')
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
    this.http
      .get<{ code: number, data: any, errorMessage: string, msg: string }>(apiUrl + 'getAllBoardType?uniCol=' +
      this.searchForm.value.unical.trim() + '&boardName=' + this.searchForm.value.boardname.trim())
      .subscribe(
        res => {
          if (res.code === 1000) {
            console.log(res.data);
            this.listOfAllModal = res.data.staticDataType;
            setTimeout(() => {
              this.isModalSpinning = false;
            }, 1000);
          } else {
            this.onCancleClearList();
          }

        }
      );
  }

  resetForm(): void {
    this.searchForm.patchValue({
      unical: '',
      boardname: '',
    });
  }



  ngOnInit() {
    this.searchForm = this.fb.group({
      // btntype: new FormControl(null),
      unical: new FormControl(''),
      boardname: new FormControl(''),
    });
    this.getFeatchData();
  }


  getFeatchData() {
    this.isSpinning = true;
    this.http
      .get<{ code: number, data: any, errorMessage: string, msg: string }>(apiUrl + 'getBoardType')
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
