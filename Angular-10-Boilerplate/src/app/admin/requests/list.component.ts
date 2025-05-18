import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEditComponent } from './add-edit.component';

@Component({
  selector: 'app-request-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  requests: {
    id: number;
    type: string;
    employee: { employeeId: string };
    requestItems: { name: string; quantity: number }[];
    status: string;
  }[] = [];

  currentUser = { role: 'Admin' };

  constructor(private http: HttpClient, private modalService: NgbModal) {}

  ngOnInit() {
    this.http.get<any[]>('/requests').subscribe((res) => {
      this.requests = res;
    });
  }

  account() {
    return this.currentUser;
  }

  edit(id: number) {
    const request = this.requests.find(r => r.id === id);
    if (!request) return;

    const modalRef = this.modalService.open(AddEditComponent, { size: 'lg' });
    modalRef.componentInstance.title = 'Edit Request';
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.request = { ...request };

    modalRef.result.then((updatedRequest) => {
      const index = this.requests.findIndex(r => r.id === id);
      if (index !== -1) this.requests[index] = updatedRequest;
    }).catch(() => {});
  }

  delete(id: number) {
    this.http.delete(`/requests/${id}`).subscribe(() => {
      this.requests = this.requests.filter(r => r.id !== id);
    });
  }

  add() {
  console.log('Add Request button clicked');

  const modalRef = this.modalService.open(AddEditComponent, { size: 'lg' });
  modalRef.componentInstance.title = 'Add Request';
  modalRef.componentInstance.request = {
    type: '',
    employee: { employeeId: '' },
    requestItems: [],
    status: 'Pending'
  };

  modalRef.result.then((newRequest) => {
    const newId = this.requests.length
      ? Math.max(...this.requests.map(r => r.id)) + 1
      : 1;

    this.requests.push({ ...newRequest, id: newId });
    console.log('New request added:', newRequest);
  }).catch(() => {
    console.log('Add Request modal closed or cancelled.');
  });
}
}
