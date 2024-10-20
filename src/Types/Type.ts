export interface UserRole {
  role: "Employee" | "Manager";
}

export interface Employee {
  _id: string;
  username: string;
}

export interface Task {
  date: string | number | Date;
  _id: string;
  title: string;
  description: string;
  createdBy: Employee;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role: "Employee" | "Manager";
  managerId?: string;
}

export interface Manager {
  id: string;
  name: string;
}

export interface Event {
  id: string;
  title: string;
  start: string;
  end?: string;
}
