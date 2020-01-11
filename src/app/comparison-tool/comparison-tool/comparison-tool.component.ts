import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/login/auth.service';

@Component({
  selector: 'app-comparison-tool',
  templateUrl: './comparison-tool.component.html',
  styleUrls: ['./comparison-tool.component.scss']
})
export class ComparisonToolComponent implements OnInit {

  username = 'admin';

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.username = this.authService.currentUser !== null ? this.authService.currentUser : 'admin';
  }

}
