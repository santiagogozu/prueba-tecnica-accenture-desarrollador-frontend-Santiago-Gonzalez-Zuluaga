import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { TodoService } from '../../services/todo.service';
import { Task, Category } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
  ],
})
export class TodoListComponent implements OnInit {
  tasks: Task[] = [];
  categories: Category[] = [];
  newTaskTitle = '';
  newCategoryName = '';
  newCategoryColor = '#000000';
  selectedCategory = 'all';
  filteredTasks: Task[] = [];

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
      this.filterTasks();
    });

    this.todoService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  addTask(): void {
    if (this.newTaskTitle.trim() && this.selectedCategory !== 'all') {
      this.todoService.addTask(this.newTaskTitle, this.selectedCategory);
      this.newTaskTitle = '';
    }
  }

  addCategory(): void {
    if (this.newCategoryName.trim()) {
      this.todoService.addCategory(this.newCategoryName);
      this.newCategoryName = '';
      this.newCategoryColor = '#000000';
    }
  }

  toggleTask(taskId: string): void {
    this.todoService.toggleTask(taskId);
  }

  deleteTask(taskId: string): void {
    this.todoService.deleteTask(taskId);
  }

  deleteCategory(categoryId: string): void {
    this.todoService.deleteCategory(categoryId);
  }

  filterTasks(): void {
    this.filteredTasks =
      this.selectedCategory === 'all'
        ? this.tasks
        : this.tasks.filter(
            (task) => task.categoryId === this.selectedCategory
          );
  }

  onCategoryChange(): void {
    this.filterTasks();
  }
}
