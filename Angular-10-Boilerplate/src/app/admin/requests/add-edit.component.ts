import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-request-add-edit',
  templateUrl: './add-edit.component.html'
})
export class AddEditComponent implements OnInit {
  @Input() id: number | null = null;
  @Input() title: string = 'Add Request';
  @Input() employees: { employeeId: string; email: string; role: string }[] = [];

  @Input() request: {
    type: string;
    employeeId?: string;
    items: { name: string; quantity: number }[];
    status?: string;
  } = {
    type: '',
    employeeId: '',
    items: [{ name: '', quantity: 1 }],
    status: 'Pending'
  };

  errorMessage = '';

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    // Ensure at least one item exists
    if (!this.request.items || this.request.items.length === 0) {
      this.request.items = [{ name: '', quantity: 1 }];
    }
  }

  addItem(): void {
    this.request.items.push({ name: '', quantity: 1 });
  }

  removeItem(index: number): void {
    if (this.request.items.length > 1) {
      this.request.items.splice(index, 1);
    }
  }

  save(): void {
    if (!this.request.type || !this.request.employeeId || this.request.items.length === 0) {
      this.errorMessage = 'Please fill out all fields and add at least one item.';
      return;
    }

    // Validate each item has a name
    if (this.request.items.some(item => !item.name || item.quantity <= 0)) {
      this.errorMessage = 'Each item must have a name and quantity greater than 0.';
      return;
    }

    this.errorMessage = '';
    this.activeModal.close(this.request); // Return only employeeId and items
  }

  cancel(): void {
    this.activeModal.dismiss();
  }
}
