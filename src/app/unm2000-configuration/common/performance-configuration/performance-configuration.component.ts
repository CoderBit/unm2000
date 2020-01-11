import { Component, OnInit , ViewChild, ElementRef, ViewEncapsulation  } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from '../../../../environments/environment';
import { SharedService } from 'src/app/shared/shared.service';
import { TranslateService } from '@ngx-translate/core';

const apiUrl = environment.API_URL + '/performance/configure/';

interface PerformanceConfiguration {
  exportSaveMaxNoOFDays: string;
  performanceSimulationTestSwitch: string;
  ftpCollectionOnuPortPm: string;
  ftpcollectOltPm: string;
}

@Component({
  selector: 'app-performance-configuration',
  templateUrl: './performance-configuration.component.html',
  styleUrls: ['./performance-configuration.component.scss']
})
export class PerformanceConfigurationComponent implements OnInit {
  isLoading = false;
  isSpinning = false;
  langValue: string;
  value = '';
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private message: NzMessageService,
    public translate: TranslateService,
    private sharedService: SharedService
  ) {
    this.sharedService.defaultLanguage().subscribe(
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
    );
   }
  panels = [{ active: true, disabled: false, title: 'Basic Configuration' }];
  performanceForm: FormGroup;
  listOfControl: Array<{ id: number; controlInstance: string }> = [];
  @ViewChild('inputElement', { static: false }) inputElement: ElementRef;

  ngOnInit() {
    // alert('first loard');
    this.performanceForm = this.fb.group({
      exportSaveMaxNoOFDays: [null, [Validators.required, Validators.pattern(this.sharedService.getDaysPatternValidation)]],
      performanceSimulationTestSwitch: [null],
      ftpCollectionOnuPortPm: [null , [Validators.required]],
      ftpcollectOltPm: [null , [Validators.required]]
    });
    this.fetchPerformanceData();
  }


  fetchPerformanceData() {
    // alert('second loard');
    this.isSpinning = true;
    this.http
      .get<{ code: number, data: PerformanceConfiguration, errorMessage: string, msg: string }>(apiUrl + 'getPerformanceConfigData')
      .subscribe(
        res => {
          if (res.code === 1000) {
            this.performanceForm.patchValue({
              performanceSimulationTestSwitch: res.data.performanceSimulationTestSwitch === 'true' ? true : false,
              ftpCollectionOnuPortPm: res.data.ftpCollectionOnuPortPm,
              ftpcollectOltPm: res.data.ftpcollectOltPm,
              exportSaveMaxNoOFDays: res.data.exportSaveMaxNoOFDays
            });
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
    if (this.performanceForm.invalid) {
      for (const field in this.performanceForm.controls) {
        if (this.performanceForm.controls.hasOwnProperty(field)) {
          this.performanceForm.controls[field].markAsDirty();
          this.performanceForm.controls[field].updateValueAndValidity();
        }
      }
      return;
    }
    this.isLoading = true;
    const formData: PerformanceConfiguration = {
      performanceSimulationTestSwitch: this.performanceForm.value.performanceSimulationTestSwitch === true ? 'true' : 'false',
      ftpCollectionOnuPortPm: this.performanceForm.value.ftpCollectionOnuPortPm,
      ftpcollectOltPm: this.performanceForm.value.ftpcollectOltPm,
      exportSaveMaxNoOFDays: this.performanceForm.value.exportSaveMaxNoOFDays
    };
    this.http
      .post<{ code: number, data: PerformanceConfiguration, errorMessage: string, msg: string }>(apiUrl + 'updatePerformanceData', formData)
      .subscribe(res => {
        if (res.code === 1000) {
          this.isLoading = false;
          this.message.success(this.translate.instant(this.sharedService.getSuccessMessage));
        }
      },
        res => {
          this.isLoading = false;
        }
      );
  }

  onChange(value: string): void {
    this.updateValue(value);
  }

  // '.' at the end or only '-' in the input box.
  onBlur(): void {
    if (this.value.charAt(this.value.length - 1) === '.' || this.value === '-') {
      this.updateValue(this.value.slice(0, -1));
    }
  }

  updateValue(value: string): void {
    const reg = /^(0|[1-9][0-9]*)(\[0-9]*)?$/;
    if ((!isNaN(+value) && reg.test(value)) || value === '' || value === '-') {
      this.value = value;
    }
    this.inputElement.nativeElement.value = this.value;
    // console.log('this is input hidden value=', this.value);
  }


  formatNumber(value: string): string {
    // tslint:disable-next-line:variable-name
    const string = `${value}`;
    const list = string.split('.');
    const prefix = list[0].charAt(0) === '-' ? '-' : '';
    let num = prefix ? list[0].slice(1) : list[0];
    let result = '';
    while (num.length > 3) {
      result = `,${num.slice(-3)}${result}`;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
  }

}




