export interface Employee {
  id: number;
  employeeId: string;
  user: { email: string };
  position: string;
  department: { name: string };
  hireDate: string;
  status: string;
}
