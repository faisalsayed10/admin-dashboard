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

export type Member = {
  id: number;
  user_id: string;
  group_id: number;
  created_at: Date;
};

export type Project = {
  id: number;
  name: string;
  created_at: Date;
  assigned_group?: { id: number; name: string };
  assigned_user?: { id: string; email: string };
};

export type Task = {
  id: number;
  name: string;
  description: string;
  body: TaskBody[];
  created_at: Date;
  project_id: number;
};

export type TaskInstance = {
  id: number;
  created_at: Date;
  user_id: string;
  task_parent_id: number;
  body: TaskBody[];
};

export type TaskBody = {
  type: "boolean" | "string";
  title: string;
  response: string | boolean;
};

export type TaskWithProject = Task & {
  project_id: {
    id: number;
    name: string;
    assigned_user: User;
    assigned_group: Group;
  };
};
