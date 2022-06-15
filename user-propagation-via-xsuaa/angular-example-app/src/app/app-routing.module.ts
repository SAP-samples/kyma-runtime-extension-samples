import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeadersComponent } from './headers/headers.component'
import { C4cTaskComponent } from './c4c-task/c4c-task.component';


const routes: Routes = [
  { path: '', component: HeadersComponent },
  {path: 'tasks', component: C4cTaskComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
