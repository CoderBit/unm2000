import { Component, OnInit, ViewChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PipePipe } from '../../shared/pipe.pipe';
import { SharedService } from 'src/app/shared/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/login/auth.service';

declare var require: any;

@Component({
  selector: 'app-nbi-configuration',
  templateUrl: './nbi-configuration.component.html',
  styleUrls: ['./nbi-configuration.component.scss'],
  providers: [PipePipe]
})
export class NbiConfigurationComponent implements OnInit {

  index = 0;
  username = 'admin';
  tabs = ['Common Configuration'];
  loadTabContent = 'Common Configuration';
  temp = require('src/assets/json/nbi.json');
  panels;
  public searchText: string;
  langValue: string;

  items: any;
  filter: any;
  @ViewChildren('someVar') filteredItems;
  constructor(
    private titleService: Title,
    private sharedService: SharedService,
    public translate: TranslateService,
    private authService: AuthService
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


  ngOnInit() {
    this.panels = this.temp.panels;
    this.titleService.setTitle('NBI-Configuration');
    this.username = this.authService.currentUser !== null ? this.authService.currentUser : 'admin';
  }

  clearSearch() {
    this.searchText = undefined;
  }

  closeTab(tab: string): void {
    console.log(tab);
    if (tab === 'Common Configuration') {
      return;
    }
    const index = this.tabs.indexOf(tab);
    this.loadTabContent = this.tabs.length > 1 ? this.tabs[index + 1] : this.tabs[0];
    this.tabs.splice(index, 1);
    const len = this.tabs.length;
    if (len === index) {
      this.loadTabContent = this.tabs[index - 1];
    }
  }

  newTab(tabName: string): void {
    this.loadTabContent = tabName;
    const index = this.tabs.indexOf(tabName);
    if (!(index > -1)) {
      this.tabs.push(tabName);
    }
    this.index = this.tabs.indexOf(tabName);
  }

  switchTab(tab: string) {
    this.loadTabContent = tab;
    this.index = this.tabs.indexOf(tab);
  }

}
