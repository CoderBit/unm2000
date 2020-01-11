import { Component, OnInit, ViewChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/login/auth.service';

@Component({
  selector: 'app-custom-keyword',
  templateUrl: './custom-keyword.component.html',
  styleUrls: ['./custom-keyword.component.scss']
})
export class CustomKeywordComponent implements OnInit {
  public searchText: string;

  items: any;
  filter: any;
  @ViewChildren('someVar') filteredItems;
  username = 'admin';
  loadTabContent = 'Key File Management';
  panels = [
    {
      active: true,
      name: 'Custom Keyword',
      childPanel: [
        {
          active: false,
          name: 'Key File Management'
        },
        {
          active: false,
          name: 'Special Character Configuration'
        }
      ]
    }
  ];

  constructor(
    private titleService: Title,
    private authService: AuthService
    ) { }

  ngOnInit() {
    this.titleService.setTitle('UNM2000 Custom Keyword');
    this.username = this.authService.currentUser !== null ? this.authService.currentUser : 'admin';
  }

  newTab(tabName: string): void {
    this.loadTabContent = tabName;
  }

  clearSearch() {
    this.searchText = undefined;
  }

}
