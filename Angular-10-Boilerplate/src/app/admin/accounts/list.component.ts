import { Component, OnInit } from '@angular/core'; 
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services'; 
import { Account } from '@app/_models';
@Component({ templateUrl: 'list.component.html' }) 
export class ListComponent implements OnInit { 
    accounts: any [];

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(accounts => this.accounts = accounts);
    }

    toggleAccountStatus(account: any) {
        account.isToggling = true;
        this.accountService.toggleStatus(account.id)
            .subscribe({
                next: (updated) => {
                    account.isActive = updated.isActive;
                    account.isToggling = false;
                },
                error: () => {
                    account.isToggling = false;
                }
            });
    }
    
}