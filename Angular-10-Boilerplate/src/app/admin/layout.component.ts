// src/app/admin/accounts/layout.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  template: `
    <div class="p-4">
      <div class="container">
        <app-subnav></app-subnav> <!-- Sub navigation -->
        <router-outlet></router-outlet> <!-- Main routed content -->
      </div>
    </div>
  `
})
export class LayoutComponent {}
