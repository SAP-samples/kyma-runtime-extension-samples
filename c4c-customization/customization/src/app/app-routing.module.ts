import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomizationFormComponent } from './customization-form/customization-form.component';
import { AutoLoginComponent } from './auto-login/auto-login.component';


const routes: Routes = [
  { path: '', component: CustomizationFormComponent },
  { path: 'autologin', component: AutoLoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
