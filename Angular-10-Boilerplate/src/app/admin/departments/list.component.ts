import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-department-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  departments: {
    id: number;
    name: string;
    description: string;
    employeeCount: number;
  }[] = [];

  currentUser = { role: 'Admin' };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.http.get<any[]>('/departments').subscribe((res) => {
      this.departments = res;
    });
  }

  account() {
    return this.currentUser;
  }

  edit(id: number) {
  this.router.navigate(['/admin/departments/edit', id]);
}

  delete(id: number) {
    this.http.delete(`/departments/${id}`).subscribe(() => {
      this.departments = this.departments.filter(d => d.id !== id);
    });
  }

  add() {
  this.router.navigate(['/admin/departments/add']);
}
}
