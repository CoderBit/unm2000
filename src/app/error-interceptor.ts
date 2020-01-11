import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd';
import { Injectable, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor, OnInit {

  langValue: string;

  constructor(
    public modalService: NzModalService,
    public translate: TranslateService,
    private sharedService: SharedService
  ) { }

  // tslint:disable-next-line:contextual-lifecycle
  ngOnInit() {
    // this.sharedService.defaultLanguage().subscribe(
    //   res => {
    //     // res.data = '1';
    //     console.log('default language==', res.data);
    //     switch (res.data) {
    //       case '0':
    //         this.langValue = 'en';
    //         break;
    //       case '1':
    //         this.langValue = 'ch';
    //         break;
    //       default:
    //     }
    //     console.log('default value language==', this.langValue);
    //     this.translate.addLangs(['en', 'ch']);
    //     this.translate.setDefaultLang(this.langValue);
    //     const browserLang = this.translate.getBrowserLang();
    //     this.translate.use(browserLang.match(/en|ch/) ? this.langValue : 'ch');
    //   }
    // );
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // console.log(req);
    const modifiedRequest = req.clone({
      headers: req.headers.set('Access-Control-Allow-Origin', '*')
    });
    return next.handle(modifiedRequest).pipe(
      tap((event: any) => {
        if (event.type === HttpEventType.Response) {
          // console.log('event.body', event.body);
          // if (event.body.code !== 1000) {
          //   this.modalService.error({
          //     nzTitle: 'Error',
          //     nzContent: event.body.message
          //   });
          // }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // console.log('error', error);
        let errorMessage = 'An Unknown Error Occured!';
        if (error.error !== null || error.error !== undefined) {
          if (error.error.message !== undefined || error.error.message !== null) {
            errorMessage = error.error.message;
          } else {
            errorMessage = error.message;
          }
        } else {
          errorMessage = error.message;
        }
        // this.modalService.error({
        //   nzTitle: 'Error',
        //   nzContent: errorMessage
        // });
        return throwError(error);
      })
    );
  }
}
