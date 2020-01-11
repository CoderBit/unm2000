import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from 'src/environments/environment';

const apiUrl = environment.API_URL;

interface Response {
  code: number;
  data: any;
  errorMessage: string;
  message: string;
  totalData: string;
}

@Component({
  selector: 'app-special-character-configuration',
  templateUrl: './special-character-configuration.component.html',
  styleUrls: ['./special-character-configuration.component.scss']
})
export class SpecialCharacterConfigurationComponent implements OnInit {

  fileToUpload: File = null;
  fileName = 'Choose File';
  listOfAllData = [];
  isLoading = false;
  @ViewChild('uploadFile', {static: false}) uploadFile: ElementRef;

  constructor(
    private http: HttpClient,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.getFile();
    for (let i = 0; i < 1; i++) {
      this.listOfAllData.push({
        id: i,
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`
      });
    }
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.fileName = this.fileToUpload !== null ? this.fileToUpload.name : 'Choose File';
  }

  upload() {
    if (this.fileToUpload === null) {
      this.message.warning('Select a File!');
      return;
    }
    const input = new FormData();
    input.append('file', this.fileToUpload);
    console.log(this.fileToUpload);

    // tslint:disable-next-line:max-line-length
    this.http.post<Response>(apiUrl + '/upload', input).subscribe(
      res => {
        if (res.code === 1000) {
          this.getFile();
          this.clearFileName();
          this.message.success('Uploaded Successfully!');
        } else if (res.code === 417) {
          this.clearFileName();
        }
      },
      err => {
        this.clearFileName();
      }
    );
  }

  // for downloading.
  /*
   * fileObject ==== encoded String
   * mimeString mime Type e.g application/x-ms-excel
   * fileName = abc.xls
   */
  initDownload(fileObject, mimeString, fileName) {
    const blob = this.base64StringtoBlob(fileObject, mimeString);
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      const downloadLink = document.createElement('a');
      downloadLink.setAttribute('target', '_blank');
      downloadLink.setAttribute('href', window.URL.createObjectURL(blob));
      downloadLink.setAttribute('download', fileName);
      document.body.append(downloadLink);
      downloadLink.click();
      downloadLink.remove();
    }
  }

  // to convert dataURI to blob
  base64StringtoBlob(base64data, mimeString) {
    // convert base64 to raw binary data held in a string
    base64data = base64data.replace(/\s/g, '');
    const byteString = window.atob(base64data);
    const array = [];
    for (let i = 0; i < byteString.length; i++) {
      array.push(byteString.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: mimeString });
  }

  download() {
    this.http.get<Response>(apiUrl + '/downloadedFile')
      .subscribe(
        res => {
          if (res.code === 1000) {
            this.initDownload(res.data.detail.detail, res.data.mimeType, res.data.fileName);
          }
        },
        err => {
          // console.log(err);
        });
  }

  delete() {
    // tslint:disable-next-line:max-line-length
    this.http.post<Response>(apiUrl + '/deleteFile', null).subscribe(
      res => {
        if (res.code === 1000) {
          this.clearFileName();
          this.getFile();
          this.message.success('Deleted!');
          // console.log(this.fileToUpload);
        }
      },
      err => {
        // console.log(err);
      }
    );
  }

  getFile() {
    this.isLoading = true;
    this.http.get<Response>(apiUrl + '/getFile').subscribe(
      res => {
        setTimeout( () => {
          this.isLoading = false;
        }, 1000);
        if (res.code === 1000) {
          this.listOfAllData = res.data !== null ? [...res.data] : [];
          // this.fileName = res.data !== null ? res.data.fileName : 'Choose File';
        }
      },
      err => {
        setTimeout( () => {
          this.isLoading = false;
        }, 1000);
        // console.log(err);
      }
    );
  }

  clearFileName() {
    this.fileToUpload = null;
    this.fileName = 'Choose File';
    (this.uploadFile.nativeElement as HTMLInputElement).value = '';
  }
}
