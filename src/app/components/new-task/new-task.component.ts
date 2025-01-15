import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskService } from '../../services/task.service';
import { TaskListComponent } from '../task-list/task-list.component';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent implements OnInit {

  taskFormData: any = {
    assignedTo: '',
    status: '',
    dueDate: '',
    priority: '',
    description: '',
  };

  assignedToOptions: string[] = []; // To hold options for the "Assigned To" dropdown
  statusOptions: string[] = ['Not Started', 'In Progress', 'Completed']; // Predefined statuses
  isEditMode: boolean = false; // Flag to determine if the form is for editing

  constructor(
    private taskService: TaskService,
    public dialogRef: MatDialogRef<TaskListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Inject task data if available for editing
  ) {}

  ngOnInit(): void {
    this.loadAssignedToOptions();

    // If the dialog has task data, set edit mode to true and populate form
    if (this.data && this.data.task) {
      this.isEditMode = true;
      this.taskFormData = { ...this.data.task }; // Prepopulate form with task data
    }
  }

  // Fetch all tasks from the backend for "Assigned To" dropdown
  loadAssignedToOptions(): void {
    this.taskService.getAllTasks().subscribe(
      (data) => {
        // Map task data to extract unique "assignedTo" options
        this.assignedToOptions = Array.from(new Set(data.map((task) => task.assignedTo)));
      },
      (error) => {
        console.error('Error loading tasks:', error);
      }
    );
  }

  // Save Task Data (Create or Update)
  saveTaskData(): void {
    if (this.isEditMode) {
      // Update task
      this.updateTask();
    } else {
      // Create new task
      this.createTask();
    }
  }

  // Create new task
  createTask(): void {
    this.taskService.createTask(this.taskFormData).subscribe(
      (response) => {
        alert('Task created successfully!');
        this.dialogRef.close(true);
      },
      (error) => {
        console.error('Failed to create task:', error);
      }
    );
  }

  // Update existing task
  updateTask(): void {
    this.taskService.updateTask(this.taskFormData).subscribe(
      (response) => {
        alert('Task updated successfully!');
        this.dialogRef.close(true);
      },
      (error) => {
        console.error('Failed to update task:', error);
      }
    );
  }

  // Close the dialog
  closeDialog() {
    this.dialogRef.close(true);
  }
}
