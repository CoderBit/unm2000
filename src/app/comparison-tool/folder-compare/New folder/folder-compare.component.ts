import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from 'src/environments/environment';

const apiUrl = environment.API_URL + '/fileManagement/';

export interface TreeNodeInterface {
  key: number;
  name: string;
  age?: number;
  level?: number;
  expand?: boolean;
  address?: string;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
}

@Component({
  selector: 'app-folder-compare',
  templateUrl: './folder-compare.component.html',
  styleUrls: ['./folder-compare.component.scss']
})
export class FolderCompareComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private message: NzMessageService
  ) {
    // this.validateForm = this.fb.group({
    //   option: ['', Validators.required],
    //   attribute: ['', Validators.required]
    // })
  }

  username = 'John Doe';
  loadTabContent = 'Folder Comparison';
  isVisible = false;
  search = false;
  validateForm: FormGroup;
  listOfControl: Array<{ id: number; controlInstanceFirst: string; controlInstance: string }> = [];
  tags = [];
  inputVisible = false;
  inputValue = '';
  resultpath: any;
  sourcepath = null;
  targetpath: any;
  re: any;
  fe: any;
  filterName = [];
  filterValue = [];
  filterBean = [];
  querycnt = true;
  Data = [{
    Files: [
      {
        fileName: '1.doc',
        parentName: 'dev',
        lastModifiedTime: '2019-12-18 15:25:02',
        fileSize: '0.0087890625 MB',
        filePath: 'D:\\dev\\1.doc'
      },
      {
        fileName: '2.pptx',
        parentName: 'dev',
        lastModifiedTime: '2019-12-18 15:25:07',
        fileSize: '0.02734375 MB',
        filePath: 'D:\\dev\\2.pptx'
      },
      {
        fileName: '3.txt',
        parentName: 'dev',
        lastModifiedTime: '2019-12-18 15:25:12',
        fileSize: '0.0 MB',
        filePath: 'D:\\dev\\3.txt'
      }
    ],
    Directory: [
      {
        parentName: 'dev',
        lastModifiedTime: '2019-12-20 10:49:14',
        directorySize: '0 MB',
        directoryName: 'test'
      },
      {
        Files: [
          {
            fileName: '22.doc',
            parentName: 'test',
            lastModifiedTime: '2019-12-18 15:25:32',
            fileSize: '0.0087890625 MB',
            filePath: 'D:\\dev\\test\\22.doc'
          },
          {
            fileName: '33.docx',
            parentName: 'test',
            lastModifiedTime: '2019-12-18 15:25:39',
            fileSize: '0.0 MB',
            filePath: 'D:\\dev\\test\\33.docx'
          }
        ],
        Directory: [
          {
            parentName: 'test',
            lastModifiedTime: '2019-12-18 16:43:39',
            directorySize: '0 MB',
            directoryName: 'test2'
          },
          {
            Files: [
              {
                fileName: '44.xls',
                parentName: 'test2',
                lastModifiedTime: '2019-12-18 15:25:45',
                fileSize: '0.0068359375 MB',
                filePath: 'D:\\dev\\test\\test2\\44.xls'
              }
            ],
            Directory: []
          }
        ]
      }
    ]
  }];
  folderData = {
    Files: [
      {
        fileName: '1.doc',
        parentName: 'dev',
        lastModifiedTime: '2019-12-18 15:25:02',
        fileSize: '0.0087890625 MB',
        filePath: 'D:\\dev\\1.doc'
      },
      {
        fileName: '2.pptx',
        parentName: 'dev',
        lastModifiedTime: '2019-12-18 15:25:07',
        fileSize: '0.02734375 MB',
        filePath: 'D:\\dev\\2.pptx'
      },
      {
        fileName: '3.txt',
        parentName: 'dev',
        lastModifiedTime: '2019-12-18 15:25:12',
        fileSize: '0.0 MB',
        filePath: 'D:\\dev\\3.txt'
      }
    ],
    Directory: [
      {
        parentName: 'dev',
        lastModifiedTime: '2019-12-20 10:49:14',
        directorySize: '0 MB',
        directoryName: 'test'
      },
      {
        Files: [
          {
            fileName: '22.doc',
            parentName: 'test',
            lastModifiedTime: '2019-12-18 15:25:32',
            fileSize: '0.0087890625 MB',
            filePath: 'D:\\dev\\test\\22.doc'
          },
          {
            fileName: '33.docx',
            parentName: 'test',
            lastModifiedTime: '2019-12-18 15:25:39',
            fileSize: '0.0 MB',
            filePath: 'D:\\dev\\test\\33.docx'
          }
        ],
        Directory: [
          {
            parentName: 'test',
            lastModifiedTime: '2019-12-18 16:43:39',
            directorySize: '0 MB',
            directoryName: 'test2'
          },
          {
            Files: [
              {
                fileName: '44.xls',
                parentName: 'test2',
                lastModifiedTime: '2019-12-18 15:25:45',
                fileSize: '0.0068359375 MB',
                filePath: 'D:\\dev\\test\\test2\\44.xls'
              }
            ],
            Directory: []
          }
        ]
      }
    ]
  };
  @ViewChild('inputElement', { static: false }) inputElement: ElementRef;

  // Campare Result Tree Logic
  newTree = [];
  child = [];


  newTreeAfter = [];
  childAfter = [];
  listOfMapData: TreeNodeInterface[] = this.newTree;
  listOfMapDataAfter: TreeNodeInterface[] = this.newTreeAfter
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};

  ngOnInit() {
    this.validateForm = this.fb.group({});
    this.addField();
    // this.makeTree();
    this.listOfMapData = this.recurr(this.folderData)[0];
    this.listOfMapData.forEach(item => {
      this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
    });

    // this.listOfMapDataAfter.forEach(item => {
    //   this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
    // });


    // console.log("this.listOfMapData", this.listOfMapData)

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
      this.listOfControl[index - 1].controlInstanceFirst,
      new FormControl(null, Validators.required)
    );
    this.validateForm.addControl(
      this.listOfControl[index - 1].controlInstance,
      new FormControl(null, Validators.required)
    );

  }
  compare() {

    if (this.sourcepath == null || this.resultpath == null || this.targetpath == null || this.sourcepath === '' || this.resultpath === '' || this.targetpath === '') {
      this.message.error(`Invalid Input Perameters`);
      console.log('Source Error');
    } else {
      const body = {
        sourceFile: "D:\\mayankawasthi\\Desktop\\xmldata\\before\\CITRANS690U20",
        targetFile: "D:\\mayankawasthi\\Desktop\\xmldata\\after\\CITRANS690U20",
        resultFile: "D:\\mayankawasthi\\Desktop\\resultdata",
        filterBean: this.filterBean
      };

      console.log('Body', body);
      this.http
        .post<{ code: number, }>('http://localhost:8084/unm2000/fileManagement/compareFolders', body)
        .subscribe(res => {
          if (res.code === 1000) {
            console.log('RES 1000', res);

          }
        },
          res => {
            console.log('RES', res);
            console.log('RES', res);
          }
        );
    }
  }

  getResult() {

    if (this.sourcepath == null || this.resultpath == null || this.targetpath == null || this.sourcepath === '' || this.resultpath === '' || this.targetpath === '') {
      this.message.error(`Invalid Input Perameters`);
      console.log('Source Error');
    } else {
      const body = {
        sourceFile: "D:\\mayankawasthi\\Desktop\\xmldata\\before\\CITRANS690U20",
        targetFile: "D:\\mayankawasthi\\Desktop\\xmldata\\after\\CITRANS690U20",
        resultFile: "D:\\mayankawasthi\\Desktop\\resultdata",
        filterBean: this.filterBean
      };

      console.log('Get Result Body', body);
      this.http
        .post<{ code: number; data: any; errorMessage: string; message: string }>('http://localhost:8084/unm2000/fileManagement/getResult', body)
        .subscribe(
          res => {
            if (res.code === 1000) {
              console.log('RES Before', res.data.before);
              // console.log('RES After', res.data.after);
              console.log(this.recurr(res.data.before)[0]);
              // this.listOfMapData = this.recurr(this.folderData)[0];
              // this.listOfMapDataAfter = this.recurr(res.data.after);
              // res.data.before.forEach(item => {
              //   this.insertFolderData(item);
              // });
              // res.data.after.forEach(item => {
              //   this.insertFolderDataAfter(item);
              // });
            }
          },
          err => {
            console.log('RES', err);
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
      console.log('Val', this.validateForm.value);
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.tags = [];
    console.log('I am Form Data', this.validateForm.value);

    this.isVisible = false;
    // const filterFormValues = this.validateForm.value;
    // const filterKeys = Object.keys(filterFormValues);
    // for (const filterKey of filterKeys) {
    //   if (filterFormValues[filterKey] !== null || filterFormValues[filterKey] !== '') {
    //     this.tags.push(filterFormValues[filterKey]);
    //   }
    // }
    console.log('this.validateForm.value.option1', this.validateForm.value);
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
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
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

  recurr(data) {
    const macro = [];
    const arr = [];
    let parent = '';
    for (const file of data.Files) {
      const inputFile = {
        key: file.fileName,
        name: file.fileName,
        fileSize: file.fileSize,
        lastModifiedTime: file.lastModifiedTime,
        type: 'file'
      };
      parent = file.parentName;
      arr.push(inputFile);
    }
    for (const directory of data.Directory) {
      if (!directory.hasOwnProperty('Files')) {
        parent = directory.parentName;
        const p = {
          key: directory.directoryName,
          name: directory.directoryName,
          fileSize: directory.directorySize,
          lastModifiedTime: directory.lastModifiedTime,
          type: 'folder',
          children: []
        };
        arr.push(p);
      }
    }
    for (const directory of data.Directory) {
      if (directory.hasOwnProperty('Files')) {
        const dat = this.recurr(directory);
        for (const t of arr) {
          if (t.name === dat[1]) {
            t.children = dat[0];
          }
        }
      }
    }
    macro.push(arr);
    macro.push(parent);
    return macro;
  }

  insertFolderData(item) {
    console.log('%c item', 'color:red;font-size:15px;', item);
    item.Directory.forEach(newditem => {
      console.log('%c Directory Item', 'color:green;font-size:15px;', newditem);
      const hasKeys = Object.keys(newditem);
      console.log(hasKeys);
      const hasFiles = hasKeys.includes('Files');
      const hasFolders = hasKeys.includes('Directory');
      if (hasFolders || hasFiles) {
        console.log(item.Directory[0].directoryName);
        this.insertFolderData(newditem);
      } else {
        const folderParent = newditem.parentName;
        const pushFolderDataParent = this.newTree.filter(aaa => {
          return (aaa.type === 'folder' && aaa.name === folderParent);
        });
        const te = this.newTree.forEach(ele => {
          if (ele.type === 'folder' && ele.name === 'test') {
            ele.children.forEach(inn => {
              if (ele.type === 'folder' && ele.name === 'test2') {
                inn.children.push();
              }
            });
          }
        });
        if (pushFolderDataParent.length > 0) {
          console.log('this.newTree', this.newTree);
          const index = this.newTree.indexOf(pushFolderDataParent[0]);
          console.log(pushFolderDataParent, index);
          this.newTree[index].children.push({ key: newditem.directoryName, name: newditem.directoryName, age: newditem.directorySize, address: newditem.lastModifiedTime, type: 'folder', parentName: newditem.parentName, children: [] });
        } else {
          this.newTree.push({ key: newditem.directoryName, name: newditem.directoryName, age: newditem.directorySize, address: newditem.lastModifiedTime, type: 'folder', parentName: newditem.parentName, children: [] });
        }

      }
    });
    item.Files.forEach(newfitem => {
      console.log('%c Files Item', 'color:blue;font-size:15px;', newfitem);
      const fileParent = newfitem.parentName;
      const aaa = (newfitem.filePath).split('\\');
      const pos = aaa.indexOf(fileParent);
      const parentArray = aaa.slice(2, pos + 1);
      // console.log('split', aaa, pos, parentArray);
      console.log('parentArray', parentArray);
      const ab = this.newTree.some(aa => aa.parentName === 'dev');
      console.log('ab', ab);
      const pushDataParent = this.newTree.filter(aaa => {
        return (aaa.type === 'folder' && aaa.name === fileParent);
      });
      if (pushDataParent.length > 0) {
        const index = this.newTree.indexOf(pushDataParent[0]);
        this.newTree[index].children.push({ key: newfitem.fileSize, name: newfitem.fileName, age: newfitem.fileSize, address: newfitem.lastModifiedTime, type: 'file' });
      } else {
        this.newTree.push({ key: newfitem.fileSize, name: newfitem.fileName, age: newfitem.fileSize, address: newfitem.lastModifiedTime, type: 'file' });
      }
      console.log('Parent', pushDataParent[0], 'File', newfitem.fileName);
    });
  }
  insertFolderDataAfter(item) {
    console.log('%c item', 'color:red;font-size:15px;', item);
    item.Directory.forEach(newditem => {
      console.log('%c Directory Item', 'color:green;font-size:15px;', newditem);
      const hasKeys = Object.keys(newditem);
      console.log(hasKeys);
      const hasFiles = hasKeys.includes('Files');
      const hasFolders = hasKeys.includes('Directory');
      if (hasFolders || hasFiles) {
        console.log(item.Directory[0].directoryName);
        this.insertFolderData(newditem);
      } else {
        const folderParent = newditem.parentName;
        const pushFolderDataParent = this.newTreeAfter.filter(aaa => {
          return (aaa.type === 'folder' && aaa.name === folderParent);
        });
        const te = this.newTreeAfter.forEach(ele => {
          if (ele.type === 'folder' && ele.name === 'test') {
            ele.children.forEach(inn => {
              if (ele.type === 'folder' && ele.name === 'test2') {
                inn.children.push();
              }
            });
          }
        });
        if (pushFolderDataParent.length > 0) {
          console.log('this.newTreeAfter', this.newTreeAfter);
          const index = this.newTreeAfter.indexOf(pushFolderDataParent[0]);
          console.log(pushFolderDataParent, index);
          this.newTreeAfter[index].children.push({ key: newditem.directoryName, name: newditem.directoryName, age: newditem.directorySize, address: newditem.lastModifiedTime, type: 'folder', parentName: newditem.parentName, children: [] });
        } else {
          this.newTreeAfter.push({ key: newditem.directoryName, name: newditem.directoryName, age: newditem.directorySize, address: newditem.lastModifiedTime, type: 'folder', parentName: newditem.parentName, children: [] });
        }

      }
    });
    item.Files.forEach(newfitem => {
      console.log('%c Files Item', 'color:blue;font-size:15px;', newfitem);
      const fileParent = newfitem.parentName;
      const aaa = (newfitem.filePath).split('\\');
      const pos = aaa.indexOf(fileParent);
      const parentArray = aaa.slice(2, pos + 1);
      // console.log('split', aaa, pos, parentArray);
      console.log('parentArray', parentArray);
      const ab = this.newTreeAfter.some(aa => aa.parentName === 'dev');
      console.log('ab', ab);
      const pushDataParent = this.newTreeAfter.filter(aaa => {
        return (aaa.type === 'folder' && aaa.name === fileParent);
      });
      if (pushDataParent.length > 0) {
        const index = this.newTreeAfter.indexOf(pushDataParent[0]);
        this.newTreeAfter[index].children.push({ key: newfitem.fileSize, name: newfitem.fileName, age: newfitem.fileSize, address: newfitem.lastModifiedTime, type: 'file' });
      } else {
        this.newTreeAfter.push({ key: newfitem.fileSize, name: newfitem.fileName, age: newfitem.fileSize, address: newfitem.lastModifiedTime, type: 'file' });
      }
      console.log('Parent', pushDataParent[0], 'File', newfitem.fileName);
    });
  }


  makeTree() {
    console.log('this.Data', this.Data);
    this.Data.forEach(item => {
      this.insertFolderData(item);
    });
    // this.Data.forEach(item => {
    //   this.insertFolderData(item);
    // })
  }

  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
    const stack: TreeNodeInterface[] = [];
    const array: TreeNodeInterface[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: false, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: TreeNodeInterface, hashMap: { [key: string]: boolean }, array: TreeNodeInterface[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }
}
