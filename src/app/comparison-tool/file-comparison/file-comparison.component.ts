import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from 'src/app/login/auth.service';
import { environment } from 'src/environments/environment';
import  xml2js  from 'xml2js';
const apiUrl = environment.API_URL + '/fileManagement/';

@Component({
  selector: 'app-file-comparison',
  templateUrl: './file-comparison.component.html',
  styleUrls: ['./file-comparison.component.scss']
})
export class FileComparisonComponent implements OnInit {

  username = 'admin';
  loadTabContent = 'File Comparison';
  isVisible = false;
  search = false;
  validateForm: FormGroup;
  listOfControl: Array<{ id: number; controlInstanceFirst: string; controlInstance: string }> = [];
  tags = [];
  inputVisible = false;
  inputValue = '';
  resultpath: any;
  sourcepath: any;
  targetpath: any;
  re: any;
  fe: any;
  filterName = [];
  filterValue = [];
  filterBean = [];
  
//  public xmlitems: any;
  @ViewChild('inputElement', { static: false }) inputElement: ElementRef;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private message: NzMessageService,
    private authService: AuthService
  ) {
    // this.validateForm = this.fb.group({
    //   option: ['', Validators.required],
    //   attribute: ['', Validators.required]
    // })
  }

  ngOnInit() {
    this.username = this.authService.currentUser !== null ? this.authService.currentUser : 'admin';
    this.validateForm = this.fb.group({});
    this.addField();
  }

  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id = this.listOfControl.length > 0 ? this.listOfControl[this.listOfControl.length - 1].id + 1 : 0;

    const control = {
      id,
      controlInstance: `attribute${id}`,
      controlInstanceFirst: `option${id}`
    };
    const index = this.listOfControl.push(control);
    this.validateForm.addControl(
      this.listOfControl[index - 1].controlInstance,
      new FormControl(null, Validators.required)
    );
    this.validateForm.addControl(
      this.listOfControl[index - 1].controlInstanceFirst,
      new FormControl(null, Validators.required)
    );
  }
  before: string;
  after: string;
  compare() {
    // tslint:disable-next-line:max-line-length
    if (this.sourcepath == null || this.resultpath == null || this.targetpath == null || this.sourcepath === '' || this.resultpath === '' || this.targetpath === '') {
      this.message.error(`Invalid Input Perameters`);
      console.log('Source Error');
    } else {
      const body = {
        "sourceFile": "D:\\testData\\xmldata\\before\\CITRANS690U20\\13175173\\13175173_48.xml",
        "targetFile": "D:\\testData\\xmldata\\after\\CITRANS690U20\\13175173\\13175173_48.xml",
        "resultFile": "D:\\testData\\resultdata",
        filterBean: this.filterBean
      };

      console.log('Body', body);
      this.http
        .post<{ code: number, data: any }>(apiUrl+'compareFiles', body)
        .subscribe(res => {
          if (res.code === 1000) {
            console.log('RES 1000', res);
            // = res.data.beforethis.before 
            //  this.before=   "<?xml version='1.0' encoding='utf-8'?> \n <NE id='13175173' type='34'>  \n <y1731_initiative>  \n   <y1731_initiative_item meg_icc='313233343536ddddd'> \n </y1731_initiative_item>   \n   <y1731_initiative_item meg_icc='313233343536ddddd'></y1731_initiative_item>  \n </y1731_initiative> \n </NE>"
            

          //   this.before = String(res.data.before).replace(/(?:\r\n|\r|\n)/gim, '<br/>');
          //   // str = str.replace(/(?:\r\n|\r|\n)/g, '<br>');
          // //   console.log("this.before 1", this.before);
          // //   this.before = this.before.replace(/\n/g, '<br/>');
          // // //   console.log(document.getElementById('second-media-left'));
          // //  var di = new DOMParser().parseFromString(this.before, 'text/html')
          // //  document.getElementById('second-media-left').textContent = this.before;
          //   // document.getElementById('second-media-right').innerHTML = this.before.toString();
          //   //   newbefore = this.before
          //   console.log("this.before 2", this.before);
          // //  const parser = new DOMParser();
          //   const  xmlDoc =  new DOMParser().parseFromString(this.before,"text/xml");
          // document.getElementById('second-media-left').textContent = this.before.toString();
            this.after = res.data.after;
            this.before = res.data.before;

            

          }
        },
          res => {
            console.log('RES', res);
            console.log('RES', res);
          }
        );
    }
  }

  removeField(i: { id: number; controlInstanceFirst: string; controlInstance: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      console.log(this.listOfControl);
      this.validateForm.removeControl(i.controlInstanceFirst);
      this.validateForm.removeControl(i.controlInstance);
    }
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    console.log(this.validateForm.value);
  }

  showModal(): void {


    this.isVisible = true;
  }

  handleOk(): void {
    this.tags = [];
    console.log('I am Form Data', this.validateForm.value);

    this.isVisible = false;
   
    console.log('this.validateForm.value.option1', this.validateForm.value);
    // tslint:disable-next-line:max-line-length
    if (this.validateForm.value.option0 == null || this.validateForm.value.attribute0 == null || this.validateForm.value.option0 === undefined || this.validateForm.value.attribute0 === undefined) {
      console.log('Empty Filter Data');
    } else {

      for (let i = 0; i < this.listOfControl.length; i++) {
        const option = 'option';
        const attribute = 'attribute';
        const no = i;
        const nos = no.toString();
        this.re = option.concat(nos);
        this.fe = attribute.concat(nos);
        if (this.validateForm.value[this.re] !== '' || this.validateForm.value[this.re] != null) {
          this.filterName.push(this.validateForm.value[this.re]);
        }
        if (this.validateForm.value[this.fe] !== '' || this.validateForm.value[this.fe] != null) {
          this.filterValue.push(this.validateForm.value[this.fe]);
          this.tags.push(this.validateForm.value[this.fe]);
          this.filterBean = [];
          this.filterBean.push({
            filterName: this.validateForm.value[this.re],
            filterValue: this.validateForm.value[this.fe]
          });
        }
      }
    }
    console.log('I am Tag Data', this.tags);
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  searchModal(): void {
    this.search = true;

    console.log(
      [{
        filterName: 'Element',
        filterValue: 'Slot'

      },
      {
        filterName: 'Attribute',
        filterValue: 'MA'
      }]);
  }
  // tags = ['Unremovable', 'Tag 2', 'Tag 3'];
  searchOk(): void {
    console.log('Button ok clicked!');
    this.search = false;
  }

  searchCancel(): void {
    console.log('Button cancel clicked!');
    this.search = false;
  }

  handleClose(removedTag: string): void {
    this.tags = this.tags.filter(tag => tag !== removedTag);
  }

  sliceTagName(tag: string): string {
    if (tag !== null) {
      const isLongTag = tag.length > 20;
      return isLongTag ? `${tag.slice(0, 20)}...` : tag;
    }
  }

  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement.nativeElement.focus();
    }, 10);
  }

  handleInputConfirm(): void {
    if (this.inputValue && this.tags.indexOf(this.inputValue) === -1) {
      this.tags = [...this.tags, this.inputValue];
    }
    this.inputValue = '';
    this.inputVisible = false;
  }



}
