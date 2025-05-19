import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-employee-transfer',
  templateUrl: './employee-transfer.component.html'
})
export class EmployeeTransferComponent {
  @Input() employeeId: string = '';
  @Input() departments: string[] = [];

  selectedDepartment: string = '';

  constructor(public activeModal: NgbActiveModal) {}

  transfer() {
    console.log(`Transfer ${this.employeeId} to ${this.selectedDepartment}`);
    this.activeModal.close(this.selectedDepartment);
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
