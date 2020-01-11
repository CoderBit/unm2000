import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SharedService } from 'src/app/shared/shared.service';

interface Data {
  id: number;
  keyFileName: string;
  bindingNeType: number;
  keyDescription: string;
  createdTime: string;
}

interface Response {
  code: number;
  data: any;
  errorMessage: string;
  message: string;
}

const apiUrl = environment.API_URL + '/keyManagement/';

@Component({
  selector: 'app-key-file-management',
  templateUrl: './key-file-management.component.html',
  styleUrls: ['./key-file-management.component.scss']
})
export class KeyFileManagementComponent implements OnInit {

  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData = [];
  listOfAllData = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  numberOfChecked = 0;
  isAdd = false;
  isModify = false;
  addForm: FormGroup;
  modifyForm: FormGroup;
  fileToUpload: File = null;
  refileToUpload: File = null;
  selectedRow;
  isLoading = false;

  @ViewChild('uploadFile', { static: false }) uploadFile: ElementRef;
  @ViewChild('reUploadFile', { static: false }) reUploadFile: ElementRef;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private http: HttpClient,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.addForm = this.fb.group({
      neType: [null, [Validators.required, Validators.pattern(this.sharedService.getCommaSeparatedNumbersValidation)]],
      description: [null, [Validators.required]],
      keyFile: [null, [Validators.required]]
    });

    this.modifyForm = this.fb.group({
      neType: [null, [Validators.required, Validators.pattern(this.sharedService.getCommaSeparatedNumbersValidation)]],
      description: [null, [Validators.required]],
      originalKeyFile: [null, [Validators.required]],
      newKeyFile: [null]
    });

    this.fetchData();
  }

  currentPageDataChange($event: Data[]): void {
    this.listOfDisplayData = $event;
    this.refreshStatus();
  }

  refreshStatus(data = null): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData
      .every(item => this.mapOfCheckedId[item.keyfile.name]);
    this.isIndeterminate =
      this.listOfDisplayData.some(item => this.mapOfCheckedId[item.keyfile.name]) &&
      !this.isAllDisplayDataChecked;
    this.numberOfChecked = this.listOfAllData.filter(item => this.mapOfCheckedId[item.keyfile.name]).length;
    this.selectedRow = this.listOfDisplayData.filter(item => (this.mapOfCheckedId[item.keyfile.name] === true));
  }

  clickAdd(): void {
    this.addForm.reset();
    this.isAdd = true;
    this.fileToUpload = null;
    (this.uploadFile.nativeElement as HTMLInputElement).value = '';
  }

  clickModify(): void {
    // console.log('selectedRow', this.selectedRow);
    this.refileToUpload = null;
    (this.reUploadFile.nativeElement as HTMLInputElement).value = '';
    const row = this.selectedRow[0];
    this.modifyForm.patchValue({
      neType: row.devicetype.typecodes,
      description: row.description.content,
      originalKeyFile: row.keyfile.name
    });
    this.isModify = true;
  }

  handleCancel(): void {
    // console.log('Button cancel clicked!');
    this.isAdd = false;
    this.isModify = false;
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.addForm.patchValue({ keyFile: this.fileToUpload });
    // console.log(this.fileToUpload);
  }

  rehandleFileInput(files: FileList) {
    this.refileToUpload = files.item(0);
    this.modifyForm.patchValue({ newKeyFile: this.refileToUpload });
    // console.log(this.refileToUpload);
  }

  fetchData() {
    this.isLoading = true;

    this.http.get<Response>(apiUrl + 'getAllFileDetails').subscribe(
      res => {
        setTimeout( () => {
          this.isLoading = false;
        }, 1000);
        if (res.code === 1000) {
          if (res.data.length > 0) {
            const response = [];
            this.mapOfCheckedId = {};
            // res.data.forEach((element, index) => {
            //   response.push({ id: index + 1, ...element });
            // });
            this.listOfAllData = [...res.data];
          } else {
            this.listOfAllData = [];
          }
        }
      }, err => {
        setTimeout( () => {
          this.isLoading = false;
        }, 1000);
        // console.log(err);
      });
  }

  onDelete() {
    const sendData = [];
    this.selectedRow.forEach(element => {
      sendData.push({ name: element.keyfile.name });
    });
    console.log(sendData);
    this.http.post<Response>(apiUrl + 'deleteKeywordFile', sendData).subscribe(
      res => {
        if (res.code === 1000) {
          this.fetchData();
          this.message.success('Keyfile is deleted successfully!');
        }
      },
      err => {
        // console.log(err);
      }
    );
  }

  onAdd(): void {
    if (this.fileToUpload === null) {
      this.message.warning('Select a file!');
    }
    if (this.addForm.invalid) {
      for (const key in this.addForm.controls) {
        if (this.addForm.controls.hasOwnProperty(key)) {
          this.addForm.controls[key].markAsDirty();
          this.addForm.controls[key].updateValueAndValidity();
        }
      }
      return;
    }
    const sendData = new FormData();
    sendData.append('neType', this.addForm.value.neType);
    sendData.append('description', this.addForm.value.description);
    sendData.append('requestType', 'add');
    sendData.append('uploadKeyFile', this.fileToUpload);
    this.http.post<Response>(apiUrl + 'addModifyKeyFile', sendData).subscribe(
      res => {
        this.fetchData();
        this.isAdd = false;
        if (res.code === 1000) {
          this.message.success('Saved Successfully!');
        }
      },
      err => {
        // console.log(err);
      }
    );
  }

  onModify(): void {
    if (this.modifyForm.invalid) {
      for (const key in this.modifyForm.controls) {
        if (this.modifyForm.controls.hasOwnProperty(key)) {
          this.modifyForm.controls[key].markAsDirty();
          this.modifyForm.controls[key].updateValueAndValidity();
        }
      }
      return;
    }
    const sendData = new FormData();
    sendData.append('neType', this.modifyForm.value.neType);
    sendData.append('description', this.modifyForm.value.description);
    sendData.append('requestType', 'modify');
    sendData.append('uploadKeyFile', null);
    sendData.append('updateKeyFile', this.refileToUpload);
    sendData.append('fileName', this.modifyForm.value.originalKeyFile);
    this.http.post<Response>(apiUrl + 'addModifyKeyFile', sendData).subscribe(
      res => {
        if (res.code === 1000) {
          this.fetchData();
          this.isModify = false;
          this.message.success('Modified Successfully!');
        }
      },
      err => {
        // console.log(err);
      }
    );
  }

}
