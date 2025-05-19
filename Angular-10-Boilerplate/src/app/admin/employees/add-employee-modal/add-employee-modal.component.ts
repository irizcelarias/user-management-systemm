import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-employee-modal',
  templateUrl: './add-employee-modal.component.html'
})
export class AddEmployeeModalComponent implements OnInit {
  employee: any = {
    employeeId: '',
    accountId: '',
    position: '',
    departmentId: '',
    hireDate: '',
    status: 'Active'
  };

  users: any[] = [];
  departments: any[] = [];

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    // Replace with actual API call
    this.users = [
      { id: 1, email: 'admin@example.com', role: 'Admin User' },
      { id: 2, email: 'user@example.com', role: 'Staff' }
    ];

    this.departments = [
      { id: 1, name: 'Engineering' },
      { id: 2, name: 'Marketing' }
    ];
  }

  save() {
  const selectedUser = this.users.find(u => u.id == this.employee.accountId);       
  const selectedDept = this.departments.find(d => d.id == this.employee.departmentId);

  const newEmployee = {
    ...this.employee,
    user: selectedUser,          
    department: selectedDept     
  };

  console.log('Returning employee from modal:', newEmployee);
  this.activeModal.close(newEmployee);
}

}
