import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-department-add-edit',
  templateUrl: './add-edit.component.html'
})
export class DepartmentAddEditComponent implements OnInit {
  id: number | null = null;
  department = {
    name: '',
    description: ''
  };
  errorMessage = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? Number(idParam) : null;

    if (this.id) {
      this.loading = true;
      this.http.get<any>(`/departments/${this.id}`).subscribe({
        next: (data) => {
          this.department = data;
          this.loading = false;
        },
        error: (err) => {
        console.warn('Department not found or backend not ready.', err);
        this.loading = false;
      }
      });
    }
  }

  save() {
    if (!this.department.name || !this.department.description) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    if (this.id) {
      // Update existing department
      this.http.put(`/departments/${this.id}`, this.department).subscribe({
        next: () => this.router.navigate(['/admin/departments']),
        error: (err) => {
          console.error('Error updating department:', err);
          this.errorMessage = 'Update failed.';
          this.loading = false;
        }
      });
    } else {
      // Add new department
      this.http.post('/departments', this.department).subscribe({
        next: () => this.router.navigate(['/admin/departments']),
        error: (err) => {
          console.error('Error creating department:', err);
          this.errorMessage = 'Creation failed.';
          this.loading = false;
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/admin/departments']);
  }
}
