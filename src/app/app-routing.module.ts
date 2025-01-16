import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaskListComponent } from './components/task-list/task-list.component';
import { NewTaskComponent } from './components/new-task/new-task.component';

import { DeleteTaskComponent } from './components/delete-task/delete-task.component';


const routes: Routes = [
  // {path:'',component:TaskFormComponent},
  {path:'',component:TaskListComponent},
  {path:'new-task',component:NewTaskComponent},
  {path:'delete-task',component:DeleteTaskComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
