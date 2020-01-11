import { NgModule } from '@angular/core';
import { ComparisonToolComponent } from './comparison-tool/comparison-tool.component';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';
import { KeyFileManagementComponent } from './custom-keyword/key-file-management/key-file-management.component';
// tslint:disable-next-line:max-line-length
import { SpecialCharacterConfigurationComponent } from './custom-keyword/special-character-configuration/special-character-configuration.component';
import { FileComparisonComponent } from './file-comparison/file-comparison.component';
import { CustomKeywordComponent } from './custom-keyword/custom-keyword.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FolderCompareComponent } from './folder-compare/folder-compare.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ComparisonToolComponent,
    KeyFileManagementComponent,
    SpecialCharacterConfigurationComponent,
    FileComparisonComponent,
    CustomKeywordComponent,
    FolderCompareComponent
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      {path: '', component: ComparisonToolComponent},
      {path: 'file-comparison', component: FileComparisonComponent},
      {path: 'folder-comparison', component: FolderCompareComponent},
      {path: 'custom-keyword', component: CustomKeywordComponent}
    ])
  ],
  exports: [
    RouterModule,
    ComparisonToolComponent
  ]
})

export class ComparisonToolModule {}
