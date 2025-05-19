import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee-add-edit',
  templateUrl: './add-edit.component.html'
})
export class AddEditComponent implements OnInit {
  id: number | null = null; // null = add, number = edit
  employee: any = {};
  users: { id: number; email: string }[] = [];
  departments: { id: number; name: string }[] = [];
  errorMessage = '';

  ngOnInit() {
    // Load users and departments from service (mocked here)
    this.users = [
      { id: 1, email: 'admin@example.com' },
      { id: 2, email: 'user@example.com' }
    ];

    this.departments = [
      { id: 1, name: 'Engineering' },
      { id: 2, name: 'Marketing' }
    ];

    // If edit, load employee data
    if (this.id) {
      this.employee = {
        id: this.id,
        employeeId: 'EMP001',
        userId: 1,
        position: 'Developer',
        departmentId: 1,
        hireDate: '2025-01-01',
        status: 'Active'
      };
    }
  }

  save() {
    if (!this.employee.employeeId || !this.employee.position) {
      this.errorMessage = 'Employee ID and position are required.';
      return;
    }

    console.log('Saved:', this.employee);
  }

  cancel() {
    console.log('Cancel clicked');
  }
}
