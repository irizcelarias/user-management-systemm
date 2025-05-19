import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from 'src/app/_models/employee.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEmployeeModalComponent } from './add-employee-modal/add-employee-modal.component';
import { Router } from '@angular/router';

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
    console.log('Transferring employee:', employee);
    // You can open a modal here if needed
  }

  edit(id: number): void {
    console.log('Editing employee:', id);
    // You can implement modal logic here if needed
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
