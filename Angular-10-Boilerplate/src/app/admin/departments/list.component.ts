import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('/departments').subscribe((res) => {
      this.departments = res;
    });
  }

  account() {
    return this.currentUser;
  }

  edit(id: number) {
    console.log('Editing department:', id);
  }

  delete(id: number) {
    this.http.delete(`/departments/${id}`).subscribe(() => {
      this.departments = this.departments.filter(d => d.id !== id);
    });
  }

  add() {
    console.log('Add new department');
  }
}
