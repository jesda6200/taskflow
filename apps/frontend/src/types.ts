export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

export interface ProjectDetail extends Project {
  tasks: Task[];
}
