import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestAddEditComponent } from './add-edit.component';

@Component({
  selector: 'app-request-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  requests: {
    id: number;
    type: string;
    employee: { employeeId: string; email: string; role: string };
    requestItems: { name: string; quantity: number }[];
    status: string;
  }[] = [];

  employees: {
    id: number;
    employeeId: string;
    email: string;
    role: string;
  }[] = [];

  currentUser = { role: 'Admin' };

  constructor(private http: HttpClient, private modalService: NgbModal) {}

  ngOnInit() {
    // Fetch requests
    this.http.get<any[]>('/requests').subscribe((res) => {
      this.requests = res;
    });

    // Fetch employees
    this.http.get<any[]>('/employees').subscribe((res) => {
      this.employees = res.map(emp => ({
        id: emp.id,
        employeeId: emp.employeeId,
        email: emp.email || `emp${emp.id}@example.com`, // fallback if no email
        role: emp.role || 'User'
      }));
    });
  }

  account() {
    return this.currentUser;
  }

  add() {
    const modalRef = this.modalService.open(RequestAddEditComponent, { size: 'lg' });
    modalRef.componentInstance.title = 'Add Request';
    modalRef.componentInstance.employees = this.employees;
    modalRef.componentInstance.request = {
      type: '',
      employeeId: '',
      items: [{ name: '', quantity: 1 }],
      status: 'Pending'
    };

    modalRef.result.then((newRequest) => {
      const newId = this.requests.length
        ? Math.max(...this.requests.map(r => r.id)) + 1
        : 1;

      const employee = this.employees.find(e => e.employeeId === newRequest.employeeId);

      const formattedRequest = {
        id: newId,
        type: newRequest.type,
        employee: employee || { employeeId: newRequest.employeeId, email: '', role: '' },
        requestItems: newRequest.items,
        status: 'Pending'
      };

      this.requests.push(formattedRequest);
    }).catch(() => {});
  }

  edit(id: number) {
    const request = this.requests.find(r => r.id === id);
    if (!request) return;

    const modalRef = this.modalService.open(RequestAddEditComponent, { size: 'lg' });
    modalRef.componentInstance.title = 'Edit Request';
    modalRef.componentInstance.employees = this.employees;
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.request = {
      ...request,
      employeeId: request.employee.employeeId,
      items: JSON.parse(JSON.stringify(request.requestItems)) // clone
    };

    modalRef.result.then((updatedRequest) => {
      const index = this.requests.findIndex(r => r.id === id);
      if (index !== -1) {
        const employee = this.employees.find(e => e.employeeId === updatedRequest.employeeId);
        this.requests[index] = {
          id,
          type: updatedRequest.type,
          employee: employee || { employeeId: updatedRequest.employeeId, email: '', role: '' },
          requestItems: updatedRequest.items,
          status: updatedRequest.status
        };
      }
    }).catch(() => {});
  }

  delete(id: number) {
    this.http.delete(`/requests/${id}`).subscribe(() => {
      this.requests = this.requests.filter(r => r.id !== id);
    });
  }
}
