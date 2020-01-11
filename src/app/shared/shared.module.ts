import { NgModule } from '@angular/core';
import { PipePipe } from '../shared/pipe.pipe';

@NgModule({
  declarations: [
    PipePipe
  ],
  imports: [],
  exports: [PipePipe],
  providers: [PipePipe]
})
export class SharedModule { }
