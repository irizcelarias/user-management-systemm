import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from 'src/app/_models/employee.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEmployeeModalComponent } from './add-employee-modal/add-employee-modal.component';
import { Router } from '@angular/router';
import { EmployeeTransferComponent } from './transfer-employee-modal/employee-transfer.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  employees: Employee[] = [];
  currentUser = { role: 'Admin' };

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.http.get<Employee[]>('/employees').subscribe((res) => {
      this.employees = res;
    });
  }

  account() {
    return this.currentUser;
  }

  viewRequests(employeeId: number): void {
    this.router.navigate(['/requests'], { queryParams: { employeeId } });
  }

  viewWorkflows(employeeId: number): void {
    this.router.navigate(['/workflows'], { queryParams: { employeeId } });
  }

  transfer(employee: Employee): void {
  const modalRef = this.modalService.open(EmployeeTransferComponent, { centered: true });
  modalRef.componentInstance.employeeId = employee.employeeId;
  modalRef.componentInstance.departments = ['Engineering', 'HR', 'IT']; // Replace with real fetch later

  modalRef.result.then((selectedDept) => {
    if (selectedDept) {
      // Find exact employee using object reference
      const index = this.employees.indexOf(employee);
      if (index !== -1) {
        this.employees[index].department = selectedDept;

        // ✅ Optionally log to confirm
        console.log(`Updated department: ${this.employees[index].employeeId} -> ${selectedDept}`);

        // ✅ Optional: save to backend/localStorage if needed
      }
    }
  }).catch(() => {});
}

  edit(id: number): void {
    console.log('Editing employee:', id);
    // Modal edit logic if needed
  }

  delete(id: number): void {
    this.http.delete(`/employees/${id}`).subscribe(() => {
      this.employees = this.employees.filter(e => e.id !== id);
    });
  }

  add(): void {
    const modalRef = this.modalService.open(AddEmployeeModalComponent, { size: 'lg' });

    modalRef.result.then((newEmployee) => {
      if (newEmployee) {
        this.employees.push(newEmployee);
      }
    }).catch(() => {});
  }
}
