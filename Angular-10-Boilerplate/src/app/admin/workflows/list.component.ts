import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-workflow-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  employeeId: number = 1; // replace with dynamic value
  currentUser = { role: 'Admin' };

  workflows: {
    id: number;
    type: string;
    details: any;
    status: string;
  }[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>(`/workflows/employee/${this.employeeId}`).subscribe((res) => {
      this.workflows = res;
    });
  }

  account() {
    return this.currentUser;
  }

  updateStatus(workflow: any) {
    this.http.put(`/workflows/${workflow.id}`, workflow).subscribe(() => {
      console.log(`Updated workflow ${workflow.id} to ${workflow.status}`);
    });
  }
}
