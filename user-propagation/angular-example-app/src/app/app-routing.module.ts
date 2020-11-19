import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeadersComponent } from './headers/headers.component'
import { AutoLoginComponent } from './auto-login/auto-login.component';
import { C4cTaskComponent } from './c4c-task/c4c-task.component';


const routes: Routes = [
  { path: '', component: HeadersComponent },
  { path: 'autologin', component: AutoLoginComponent },
  {path: 'tasks', component: C4cTaskComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
