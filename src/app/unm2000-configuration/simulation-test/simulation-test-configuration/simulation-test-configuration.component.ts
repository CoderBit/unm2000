import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from '../../../../environments/environment';
import { SharedService } from 'src/app/shared/shared.service';
import { TranslateService } from '@ngx-translate/core';

const apiUrl = environment.API_URL + '/simulation/test/';

interface SimulationConfiguration {
  simulationTestSwitch: string;
}

@Component({
  selector: 'app-simulation-test-configuration',
  templateUrl: './simulation-test-configuration.component.html',
  styleUrls: ['./simulation-test-configuration.component.scss']
})
export class SimulationTestConfigurationComponent implements OnInit {

  panels = [ { active: true, disabled: false, title: this.translate.instant('Basic Configuration')}];
  simulationForm: FormGroup;
  switchValue = false;
  isSpinning = false;
  isLoading = false;
  langValue: string;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private message: NzMessageService,
    private sharedService: SharedService,
    public translate: TranslateService
  ) {this.sharedService.defaultLanguage().subscribe(
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

  ngOnInit() {
    this.simulationForm = this.fb.group({
      simulationTestSwitch: new FormControl(this.switchValue)
    });
    this.fetchSimulationData();
  }

  fetchSimulationData() {
    this.isSpinning = true;
    this.http
      .get<{ code: number, data: SimulationConfiguration, errorMessage: string, msg: string }>(apiUrl + 'getSimulationTestConfig')
      .subscribe(
        res => {
          if (res.code === 1000) {
            this.simulationForm.patchValue({
              simulationTestSwitch: res.data.simulationTestSwitch === 'true' ? true : false,
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
    if (this.simulationForm.invalid) {
      for (const field in this.simulationForm.controls) {
        if (this.simulationForm.controls.hasOwnProperty(field)) {
          this.simulationForm.controls[field].markAsDirty();
          this.simulationForm.controls[field].updateValueAndValidity();
        }
      }
      return;
    }
    this.isLoading = true;
    const formData: SimulationConfiguration = {
      simulationTestSwitch: this.simulationForm.value.simulationTestSwitch,
    };
    this.http
      .post<{ code: number, data: SimulationConfiguration, errorMessage: string, msg: string }>(apiUrl +
         'updateSimulationTestConfig', formData)
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

}
