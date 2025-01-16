import { Component, HostListener, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { MatDialog } from '@angular/material/dialog';
import { NewTaskComponent } from '../new-task/new-task.component';
import { DeleteTaskComponent } from '../delete-task/delete-task.component';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit{

  p : number =1;
  count  : number =5;
  
  tasks: any[] = [];
  isLoading = true;

  constructor(private taskService: TaskService,
    private dialog : MatDialog
  ) {}

  activeDropdown: number | null = null;

  toggleDropdown(taskId: number, event: MouseEvent): void {
    event.stopPropagation(); // Prevent closing when clicking inside
    this.activeDropdown = this.activeDropdown === taskId ? null : taskId;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.activeDropdown = null;
    }
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe(
      (data) => {
        this.tasks = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching tasks:', error);
        this.isLoading = false;
      }
    );
  }

  editTask(_t40: any) {
    throw new Error('Method not implemented.');
    }

  openNewTaskDialog(): void {
    this.dialog.open(NewTaskComponent, {
      width: '50%', // Set width for the dialog
      height:'450px',
      
    });
  }

  

  openDeleteDialog(taskName: string,taskId: number): void {
    const dialogRef = this.dialog.open(DeleteTaskComponent, {
      width: '600px',
      data: { taskName }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(`Task '${taskName}' deleted!`);
        this.taskService.deleteTask(taskId).subscribe(
          () => {
            this.tasks = this.tasks.filter((task) => task.id !== taskId);
          },
          (error) => {
            console.error('Error deleting task:', error);
          }
        );
      }
    });
  }

  openEditDialog(taskId: number, taskStatus: string, taskDueDate: Date, priority: string, taskName: string): void {
    const dialogRef = this.dialog.open(NewTaskComponent, {
      width: '700px',
      data: {
        taskId,
        taskStatus,
        taskDueDate,
        priority,
        taskName
      }
    });
  
    // After dialog is closed, handle the result (updated task data)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedTask = {
          id: result.taskId,
          status: result.taskStatus,
          dueDate: result.taskDueDate,  // Correcting the 'date' to 'dueDate' for consistency
          priority: result.priority,
          name: result.taskName,
          description: result.taskDescription
        };
  
        // Call the update API with the updated task data
        this.taskService.updateTask(updatedTask).subscribe(
          () => {
            // Update the task in the local list
            const index = this.tasks.findIndex((task) => task.id === taskId);
            if (index !== -1) {
              this.tasks[index] = { ...this.tasks[index], ...updatedTask };
            }
            console.log(`Task '${updatedTask.name}' updated successfully!`);
          },
          (error) => {
            console.error('Error updating task:', error);
          }
        );
      }
    });
  }
  
  
}
