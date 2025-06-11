import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, Category } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private tasks = new BehaviorSubject<Task[]>([]);
  private categories = new BehaviorSubject<Category[]>([]);

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const savedTasks = localStorage.getItem('tasks');
    const savedCategories = localStorage.getItem('categories');

    if (savedTasks) {
      this.tasks.next(JSON.parse(savedTasks));
    }
    if (savedCategories) {
      this.categories.next(JSON.parse(savedCategories));
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks.value));
    localStorage.setItem('categories', JSON.stringify(this.categories.value));
  }

  getTasks(): Observable<Task[]> {
    return this.tasks.asObservable();
  }

  getCategories(): Observable<Category[]> {
    return this.categories.asObservable();
  }

  addTask(title: string, categoryId: string): void {
    const task: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      categoryId,
    };
    this.tasks.next([...this.tasks.value, task]);
    this.saveToLocalStorage();
  }

  toggleTask(taskId: string): void {
    const updatedTasks = this.tasks.value.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    this.tasks.next(updatedTasks);
    this.saveToLocalStorage();
  }

  deleteTask(taskId: string): void {
    this.tasks.next(this.tasks.value.filter((task) => task.id !== taskId));
    this.saveToLocalStorage();
  }

  addCategory(name: string): void {
    const category: Category = {
      id: Date.now().toString(),
      name,
    };
    this.categories.next([...this.categories.value, category]);
    this.saveToLocalStorage();
  }

  deleteCategory(categoryId: string): void {
    this.categories.next(
      this.categories.value.filter((cat) => cat.id !== categoryId)
    );
    this.tasks.next(
      this.tasks.value.filter((task) => task.categoryId !== categoryId)
    );
    this.saveToLocalStorage();
  }
}
