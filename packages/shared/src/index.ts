export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}
