import { Routes, PreloadAllModules } from '@angular/router';

export const routes: Routes = [
  {
    path: 'todo',
    loadComponent: () =>
      import('./components/todo-list/todo-list.component').then(
        (m) => m.TodoListComponent
      ),
    data: { preload: true },
  },
  { path: '', redirectTo: 'todo', pathMatch: 'full' },
];
