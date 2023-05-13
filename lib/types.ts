export type Group = {
  id: number;
  name: string;
  created_at: Date;
};

export type User = {
  id: string;
  email: string;
  role: "admin" | "user";
};

export type Project = {
  id: number;
  name: string;
  created_at: Date;
  assigned_group?: number;
  assigned_user?: string;
};

export type Task = {
  id: number;
  name: string;
  description: string;
  body: any;
  created_at: Date;
  project_id: number;
};

export type TaskInstance = {
  id: number;
  created_at: Date;
  user_id: string;
  task_parent_id: number;
  body: any;
};
