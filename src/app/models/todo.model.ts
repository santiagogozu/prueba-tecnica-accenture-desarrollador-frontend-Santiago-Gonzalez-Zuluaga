export interface Task {
  id: string;
  title: string;
  completed: boolean;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
}
