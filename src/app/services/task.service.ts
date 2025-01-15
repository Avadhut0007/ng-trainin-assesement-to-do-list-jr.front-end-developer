import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class TaskService {
 
  constructor(private http:HttpClient) { }

  private apiUrl = 'http://localhost:8080/api/tasks';

  getAllTasks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

   // Fetch a single task by ID
   getTaskById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Create a new task
  createTask(task: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, task);
  }

  updateTask(task: { id: number; name: string; description: string }): Observable<any> {
    return this.http.put(`/api/tasks/${task.id}`, task);
  }
  

  // Delete a task by ID
  deleteTask(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  
}
