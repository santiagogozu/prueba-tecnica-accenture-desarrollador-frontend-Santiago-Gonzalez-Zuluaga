import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  getTasks(skip?: number, take?: number): Observable<Task[]> {
    return this.tasks.asObservable().pipe(
      map((tasks) => {
        if (skip === undefined) return tasks;
        const start = skip;
        const end = take ? skip + take : undefined;
        return tasks.slice(start, end);
      })
    );
  }

  getCategories(): Observable<Category[]> {
    return this.categories.asObservable();
  }

  getTasksByCategory(categoryId: string): Task[] {
    return this.tasks.value.filter((task) => task.categoryId === categoryId);
  }

  addTask(title: string, categoryId: string): void {
    if (!title.trim() || !categoryId) return;

    const task: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      categoryId,
    };
    const currentTasks = this.tasks.getValue();
    this.tasks.next([...currentTasks, task]);
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
    const updatedTasks = this.tasks.value.filter((task) => task.id !== taskId);
    this.tasks.next(updatedTasks);
    this.saveToLocalStorage();
  }

  addCategory(name: string, color?: string): void {
    if (!name.trim()) return;

    const category: Category = {
      id: Date.now().toString(),
      name,
      color,
    };
    const currentCategories = this.categories.getValue();
    this.categories.next([...currentCategories, category]);
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

  updateCategory(id: string, updates: Partial<Category>): void {
    const currentCategories = this.categories.getValue();
    const updatedCategories = currentCategories.map((cat) =>
      cat.id === id ? { ...cat, ...updates } : cat
    );
    this.categories.next(updatedCategories);
    this.saveToLocalStorage();
  }
}
