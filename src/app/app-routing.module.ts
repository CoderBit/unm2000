import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: 'configuration-tools', loadChildren: () => import('./configuration-tools/configuration-tools.module').then(m => m.ConfigurationToolsModule) },
  { path: 'unm200-configuration', loadChildren: () => import('./unm2000-configuration/unm2000-configuration.module').then(m => m.UnmConfigurationModule) },
  { path: 'nbi-configuration', loadChildren: () => import('./nbi-configuration/nbi-configuration.module').then(m => m.NBIConfigurationModule) },
  { path: 'log-configuration', loadChildren: () => import('./log-configuration/log-configuration.module').then(m => m.NBIConfigurationModule) },
  { path: 'comparison-tool', loadChildren: () => import('./comparison-tool/comparision-tool.module').then(m => m.ComparisonToolModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })],
  exports: [RouterModule]
})




export class AppRoutingModule { }
