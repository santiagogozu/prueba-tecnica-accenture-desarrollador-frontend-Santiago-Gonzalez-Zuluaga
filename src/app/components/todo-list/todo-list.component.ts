import {
  Component,
  OnInit,
  OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonInput,
  IonButton,
  IonIcon,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonItemGroup,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  bookmark,
  create,
  filter,
  list,
  search,
  trash,
  add,
  addCircle,
} from 'ionicons/icons';
import { TodoService } from '../../services/todo.service';
import { FeatureFlagsService } from '../../services/feature-flags.service';
import { Task, Category } from '../../models/todo.model';
import { firstValueFrom } from 'rxjs';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    // IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonInput,
    IonButton,
    IonIcon,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonCheckbox,
    IonItemGroup,
  ],
})
export class TodoListComponent implements OnInit, OnDestroy {
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
  isLoading = true;
  private pageSize = 10;
  private destroy$ = new Subject<void>();
  editingCategory: Category | null = null;
  newCategoryDescription = '';

  constructor(
    private todoService: TodoService,
    private featureFlagsService: FeatureFlagsService
  ) {
    addIcons({
      bookmark,
      create,
      filter,
      list,
      search,
      trash,
      add,
      'add-task': addCircle,
    });
  }

  ngOnInit(): void {
    this.todoService
      .getTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe((tasks) => {
        this.tasks = tasks;
        this.applyFilters();
      });

    this.todoService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((categories) => {
        this.categories = categories;
      });

    this.featureFlagsService.isCategoryColorsEnabled().subscribe((enabled) => {
      this.categoryColorsEnabled = enabled;
    });

    Promise.all([this.loadInitialTasks(), this.loadCategories()]).finally(
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async loadInitialTasks(): Promise<void> {
    // Cargar solo las primeras 10 tareas inicialmente
    const initialTasks = await firstValueFrom(
      this.todoService.getTasks(0, this.pageSize)
    );
    this.tasks = initialTasks;
    this.filteredTasks = initialTasks;

    // Cargar el resto en segundo plano
    setTimeout(() => this.loadRemainingTasks(), 2000);
  }

  private async loadCategories(): Promise<void> {
    this.categories = await firstValueFrom(this.todoService.getCategories());
  }

  private async loadRemainingTasks(): Promise<void> {
    const remainingTasks = await firstValueFrom(
      this.todoService.getTasks(this.pageSize)
    );
    this.tasks = [...this.tasks, ...remainingTasks];
    this.applyFilters();
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
    this.filteredTasks = this.filteredTasks.filter(
      (task) => task.id !== taskId
    );
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

  startEditingCategory(category: Category): void {
    this.editingCategory = { ...category };
    this.newCategoryName = category.name;
    this.newCategoryDescription = category.description || '';
    this.newCategoryColor = category.color || '#000000';
  }

  updateCategory(): void {
    if (!this.editingCategory || !this.newCategoryName.trim()) return;

    this.todoService.updateCategory(this.editingCategory.id, {
      name: this.newCategoryName,
      description: this.newCategoryDescription,
      color: this.categoryColorsEnabled ? this.newCategoryColor : undefined,
    });

    this.cancelEdit();
  }

  cancelEdit(): void {
    this.editingCategory = null;
    this.newCategoryName = '';
    this.newCategoryDescription = '';
    this.newCategoryColor = '#000000';
  }
}
