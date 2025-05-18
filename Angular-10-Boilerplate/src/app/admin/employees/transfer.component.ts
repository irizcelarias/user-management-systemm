import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-transfer-employee',
  templateUrl: './transfer.component.html'
})
export class TransferComponent implements OnInit {
  @Input() employee: any;
  departments: { id: number; name: string }[] = [];
  departmentId: number;
  
  ngOnInit() {
    // Ideally fetch this from backend
    this.departments = [
      { id: 1, name: 'Engineering' },
      { id: 2, name: 'Marketing' }
    ];

    this.departmentId = this.employee?.departmentId;
  }

  transfer() {
    if (!this.departmentId) return;
    console.log(`Transferred ${this.employee.employeeId} to department ID ${this.departmentId}`);
  }

  cancel() {
    console.log('Transfer cancelled');
  }
}
