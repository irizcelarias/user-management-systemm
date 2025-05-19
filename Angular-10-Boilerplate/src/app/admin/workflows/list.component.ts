import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-workflow-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  employeeId: number = 0;
  workflows: any[] = [];
  currentUser = { role: 'Admin' };

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.employeeId = +params['employeeId'];
      this.http.get<any[]>(`/workflows/employee/${this.employeeId}`).subscribe(res => {
        this.workflows = res;
      });
    });
  }

  account() {
    return this.currentUser;
  }

  updateStatus(workflow: any) {
    this.http.put(`/workflows/${workflow.id}`, workflow).subscribe(() => {
      console.log('Workflow status updated:', workflow.status);
    });
  }
}
