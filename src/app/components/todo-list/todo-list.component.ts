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
import { FeatureFlagsService } from '../../services/feature-flags.service';
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
  searchText = '';
  filterCategory = 'all';
  categoryColorsEnabled = false;

  constructor(
    private todoService: TodoService,
    private featureFlagsService: FeatureFlagsService
  ) {}

  ngOnInit(): void {
    this.todoService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
      this.filteredTasks = tasks; // Mostrar todas las tareas por defecto
    });

    this.todoService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });

    this.featureFlagsService.isCategoryColorsEnabled().subscribe((enabled) => {
      this.categoryColorsEnabled = enabled;
    });
  }

  addTask(): void {
    if (this.newTaskTitle.trim()) {
      const categoryId =
        this.selectedCategory === 'all'
          ? 'sin-categoria'
          : this.selectedCategory;
      this.todoService.addTask(this.newTaskTitle, categoryId);
      this.newTaskTitle = '';
      this.loadAllTasks(); // Cargar todas las tareas sin filtrar
    }
  }

  addCategory(): void {
    if (this.newCategoryName.trim()) {
      const category = {
        name: this.newCategoryName,
        color: this.categoryColorsEnabled ? this.newCategoryColor : undefined,
      };
      this.todoService.addCategory(this.newCategoryName, category.color);
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

  loadAllTasks(): void {
    this.filteredTasks = this.tasks;
  }

  applyFilters(): void {
    let result = [...this.tasks];

    if (this.searchText.trim()) {
      result = result.filter((task) =>
        task.title.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    if (this.filterCategory !== 'all') {
      result = result.filter((task) => task.categoryId === this.filterCategory);
    }

    this.filteredTasks = result;
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find((cat) => cat.id === categoryId);
    return category ? category.name : '';
  }

  getCategoryStyle(categoryId: string): object {
    if (!this.categoryColorsEnabled) return {};

    const category = this.categories.find((cat) => cat.id === categoryId);
    return category?.color ? { 'background-color': category.color } : {};
  }

  getCategoryColor(categoryId: string): string | null {
    if (!this.categoryColorsEnabled) return null;
    const category = this.categories.find((cat) => cat.id === categoryId);
    return category?.color || null;
  }
}
