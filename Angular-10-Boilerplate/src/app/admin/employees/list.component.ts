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

constructor(private http: HttpClient, private modalService: NgbModal, private router: Router) {}

  ngOnInit() {
    this.http.get<Employee[]>('/employees').subscribe((res) => {
      this.employees = res;
    });
  }

  account() {
    return this.currentUser;
  }

  viewRequests(id: number) {
  this.router.navigate(['/requests'], { queryParams: { employeeId: id } });
  }

  viewWorkflows(id: number) {
    console.log('Viewing workflows for employee:', id);
  }

  transfer(employee: Employee) {
    console.log('Transferring employee:', employee);
  }

  edit(id: number) {
    console.log('Editing employee:', id);
  }

  delete(id: number) {
    this.http.delete(`/employees/${id}`).subscribe(() => {
      this.employees = this.employees.filter(e => e.id !== id);
    });
  }

  add() {
  const modalRef = this.modalService.open(AddEmployeeModalComponent, { size: 'lg' });

  modalRef.result.then((newEmployee) => {
    if (newEmployee) {
      console.log('Returned employee from modal:', newEmployee);
      this.employees.push(newEmployee);
    }
  }).catch(() => {});
}
}
