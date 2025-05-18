import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-request-add-edit',
  templateUrl: './add-edit.component.html'
})
export class AddEditComponent {
  @Input() id: number | null = null;

  @Input() request: {
    type: string;
    employee: { employeeId: string; email: string; role: string } | null;
    items: { name: string; quantity: number }[];
    status?: string;
  } = {
    type: '',
    employee: null,
    items: [{ name: '', quantity: 1 }],
    status: 'Pending'
  };

  @Input() title: string = 'Add Request';
  errorMessage = '';

  employees = [
    { employeeId: 'EMP001', email: 'admin@example.com', role: 'Admin User' },
    { employeeId: 'EMP002', email: 'user@example.com', role: 'Normal User' }
  ];

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {
    if (!this.request.items || this.request.items.length === 0) {
      this.request.items = [{ name: '', quantity: 1 }];
    }
  }

  addItem() {
    this.request.items.push({ name: '', quantity: 1 });
  }

  removeItem(index: number) {
    this.request.items.splice(index, 1);
  }

  save() {
    if (!this.request.type || !this.request.employee || this.request.items.length === 0) {
      this.errorMessage = 'Please fill out all fields and add at least one item.';
      return;
    }
    this.activeModal.close(this.request);
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
