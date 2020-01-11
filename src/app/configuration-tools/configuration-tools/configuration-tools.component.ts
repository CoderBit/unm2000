import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/login/auth.service';

@Component({
  selector: 'app-configuration-tools',
  templateUrl: './configuration-tools.component.html',
  styleUrls: ['./configuration-tools.component.scss']
})
export class ConfigurationToolsComponent implements OnInit {

  username = 'admin';
  langValue: any;

  constructor(
    private titleService: Title,
    public translate: TranslateService,
    private sharedService: SharedService,
    private authService: AuthService
    ) {
      // this.sharedService.defaultLanguage().subscribe(
      //   res => {
      //     console.log('default language==', res.data );
      //     if (res.data === '0') {
      //       this.langValue = 'en';
      //       console.log('default language==', this.langValue );
      //     } else {
      //       this.langValue = 'ch';
      //       // console.log('default language==', this.langValue );
      //     }
      //     console.log('default value language==', this.langValue );
      //     translate.addLangs(['en', 'ch']);
      //     translate.setDefaultLang(this.langValue);
      //     const browserLang = translate.getBrowserLang();
      //     translate.use(browserLang.match(/en|ch/) ? this.langValue : 'ch');
      //   }
      // );
  }

  ngOnInit() {
    this.titleService.setTitle('UNM2 Tools');
    this.username = this.authService.currentUser !== null ? this.authService.currentUser : 'admin';
  }

}
