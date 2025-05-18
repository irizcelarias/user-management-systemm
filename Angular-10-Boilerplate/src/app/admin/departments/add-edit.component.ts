import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-department-add-edit',
  templateUrl: './add-edit.component.html'
})
export class AddEditComponent implements OnInit {
  id: number | null = null; // null = add, number = edit
  department = {
    name: '',
    description: ''
  };
  errorMessage = '';

  ngOnInit() {
    if (this.id) {
      // Load department for editing - mock data
      this.department = {
        name: 'Engineering',
        description: 'Software department'
      };
    }
  }

  save() {
    if (!this.department.name || !this.department.description) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    console.log('Saved department:', this.department);
  }

  cancel() {
    console.log('Cancelled');
  }
}
