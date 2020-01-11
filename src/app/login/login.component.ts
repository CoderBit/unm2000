import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { AuthService } from './auth.service';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  langValue: any;
  title: string;


  constructor(
    private titleService: Title,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public translate: TranslateService,
    private sharedService: SharedService
  ) {
    // this.sharedService.defaultLanguage().subscribe(
    //   res => {
    //     // res.data = '1';
    //     console.log('default language==', res.data);
    //     switch (res.data) {
    //      case '0':
    //         this.langValue = 'en';
    //         break;
    //     case '1':
    //         this.langValue = 'ch';
    //         break;
    //     default:
    //     }
    //     console.log('default value language==', this.langValue );
    //     translate.addLangs(['en', 'ch']);
    //     translate.setDefaultLang(this.langValue);
    //     const browserLang = translate.getBrowserLang();
    //     translate.use(browserLang.match(/en|ch/) ? this.langValue : 'ch');
    //     setTimeout(() => this.titleService.setTitle(this.translate.instant('login')), 0);
    //   }
    // );

  }

  ngOnInit() {
    this.title = 'login';
    // const titled: string = this.translate.instant('login');
    // this.titleService.setTitle(titled);
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.loginForm.controls) {
        this.loginForm.controls[i].markAsDirty();
        this.loginForm.controls[i].updateValueAndValidity();
      }
      return;
    }
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password);
    // const curLang = this.translate.currentLang;
    // localStorage.setItem('selLang', curLang);
  }

}
