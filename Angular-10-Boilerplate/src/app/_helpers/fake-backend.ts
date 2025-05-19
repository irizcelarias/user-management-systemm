import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';

import { AlertService } from '@app/_services';
import { Role } from '@app/_models';

// array in local storage for accounts
const accountsKey = 'angular-10-signup-verification-boilerplate-accounts';
let accounts = JSON.parse(localStorage.getItem(accountsKey)) || [];
let departments = [
  { id: 1, name: 'Engineering', description: 'Tech', employeeCount: 3 },
  { id: 2, name: 'HR', description: 'People Ops', employeeCount: 1 }
];

let employees = [
  {
    id: 1,
    employeeId: 'EMP001',
    userId: 1,
    position: 'Developer',
    departmentId: 1,
    hireDate: '2025-01-01',
    status: 'Active'
  }
];

let requests = [
  {
    id: 1,
    employeeId: 1,
    type: 'Equipment',
    requestItems: [{ name: 'Laptop', quantity: 1 }],
    status: 'Pending'
  }
];

let workflows = JSON.parse(localStorage.getItem('workflows') || 'null') || [
  {
    id: 1,
    employeeId: 1,
    type: 'Onboarding',
    details: { step: 'Task: Complete the required government forms' },
    status: 'Pending'
  }
];


@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    constructor(private alertService: AlertService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;
        const alertService = this.alertService;

        return handleRoute();
 
        function handleRoute() {
            switch (true) {
                case url.endsWith('/accounts/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/accounts/refresh-token') && method === 'POST':
                    return refreshToken();
                case url.endsWith('/accounts/revoke-token') && method === 'POST':
                    return revokeToken();
                case url.endsWith('/accounts/register') && method === 'POST':
                    return register();
                case url.endsWith('/accounts/verify-email') && method === 'POST':
                    return verifyEmail();
                case url.endsWith('/accounts/forgot-password') && method === 'POST':
                    return forgotPassword();
                case url.endsWith('/accounts/validate-reset-token') && method === 'POST':
                    return validateResetToken();
                case url.endsWith('/accounts/reset-password') && method === 'POST':
                    return resetPassword();
                case url.endsWith('/accounts') && method === 'GET':
                    return getAccounts();
                case url.match(/\/accounts\/\d+$/) && method === 'GET':
                    return getAccountById();
                case url.endsWith('/accounts') && method === 'POST':
                    return createAccount();
                case url.match(/\/accounts\/\d+$/) && method === 'PUT':
                    return updateAccount();
                case url.match(/\/accounts\/\d+\/toggle-status$/) && method === 'PUT':
                    return toggleAccountStatus();
                case url.endsWith('/departments') && method === 'GET':
                    return ok(departments);
                case url.endsWith('/departments') && method === 'POST':
                    const dept = { id: departments.length + 1, ...body, employeeCount: 0 };
                    departments.push(dept);
                    return ok(dept);
                case url.match(/\/departments\/\d+$/) && method === 'PUT':
                    const deptId = idFromUrl();
                    const deptIndex = departments.findIndex(d => d.id === deptId);
                    if (deptIndex === -1) return error('Department not found');
                    departments[deptIndex] = { ...departments[deptIndex], ...body };
                    return ok(departments[deptIndex]);
                case url.match(/\/departments\/\d+$/) && method === 'DELETE':
                    const delDeptId = idFromUrl();
                    departments = departments.filter(d => d.id !== delDeptId);
                    return ok();
                    case url.endsWith('/employees') && method === 'GET':
                    return ok(employees);
                case url.endsWith('/employees') && method === 'POST':
                    const newEmp = { id: employees.length + 1, ...body };
                    employees.push(newEmp);
                    return ok(newEmp);
                case url.match(/\/employees\/\d+$/) && method === 'PUT':
                    const empId = idFromUrl();
                    const empIndex = employees.findIndex(e => e.id === empId);
                    if (empIndex === -1) return error('Employee not found');
                    employees[empIndex] = { ...employees[empIndex], ...body };
                    return ok(employees[empIndex]);
                case url.match(/\/employees\/\d+$/) && method === 'DELETE':
                    const delEmpId = idFromUrl();
                    employees = employees.filter(e => e.id !== delEmpId);
                    return ok();
                case url.endsWith('/requests') && method === 'GET':
                    return ok(requests);
                case url.endsWith('/requests') && method === 'POST':
                    const req = { id: requests.length + 1, employeeId: currentAccount()?.id || 1, ...body };
                    requests.push(req);
                    return ok(req);
                case url.match(/\/requests\/\d+$/) && method === 'PUT':
                    const reqId = idFromUrl();
                    const reqIndex = requests.findIndex(r => r.id === reqId);
                    if (reqIndex === -1) return error('Request not found');
                    requests[reqIndex] = { ...requests[reqIndex], ...body };
                    return ok(requests[reqIndex]);
                case url.match(/\/requests\/\d+$/) && method === 'DELETE':
                    const delReqId = idFromUrl();
                    requests = requests.filter(r => r.id !== delReqId);
                    return ok();
                case url.match(/\/workflows\/employee\/\d+$/) && method === 'GET':
                    const workflowEmpId = idFromUrl();
                    const wf = workflows.filter(w => w.employeeId === workflowEmpId);
                    return ok(wf);
                case url.endsWith('/workflows') && method === 'POST':
                    const wfNew = { id: workflows.length + 1, ...body };
                    workflows.push(wfNew);
                    localStorage.setItem('workflows', JSON.stringify(workflows));  
                    return ok(wfNew);
                case url.match(/\/workflows\/\d+$/) && method === 'PUT':
                    const wfId = idFromUrl();
                    const wfIndex = workflows.findIndex(w => w.id === wfId);
                    if (wfIndex === -1) return error('Workflow not found');
                    workflows[wfIndex] = { ...workflows[wfIndex], ...body };
                    localStorage.setItem('workflows', JSON.stringify(workflows)); 
                    return ok(workflows[wfIndex]);
                    
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }
        }

        // route functions

        function authenticate() {
            const { email, password } = body;
            const account = accounts.find(x => x.email === email && x.password === password);
        
            if (!account && !account.isVerified) return error('Email or password is incorrect');
                
            if (account.isActive === false) {
                return error('Your account is currently deactivated, reach out to your administrator.');
            }
        
            // add refresh token to account
            account.refreshTokens.push(generateRefreshToken());
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
        
            return ok({
                ...basicDetails(account),
                jwtToken: generateJwtToken(account)
            });
        }
        

        function refreshToken() {
            const refreshToken = getRefreshToken();
            
            if (!refreshToken) return unauthorized();

            const account = accounts.find(x => x.refreshTokens.includes(refreshToken));
            
            if (!account) return unauthorized();

            // replace old refresh token with a new one and save
            account.refreshTokens = account.refreshTokens.filter(x => x !== refreshToken);
            account.refreshTokens.push(generateRefreshToken());
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            return ok({
                ...basicDetails(account),
                jwtToken: generateJwtToken(account)
            });

        }

        function revokeToken() {
            if (!isAuthenticated()) return unauthorized();

            const refreshToken = getRefreshToken();
            const account = accounts.find(x => x.refreshTokens.includes(refreshToken));

            // revoke token and save
            account.refreshTokens = account.refreshTokens.filter(x => x !== refreshToken);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            return ok();
        }

        function register() {
            const account = body;
        
            if (accounts.find(x => x.email === account.email)) {
                // display email already registered "email" in alert
                setTimeout(() => {
                    alertService.info(
                        `<h4>Email Already Registered</h4>
                        <p>Your email ${account.email} is already registered.</p>
                        <p>If you don't know your password please visit the <a href="${location.origin}/account/forgot-password">forgot password</a> page.</p>
                        <div><strong>NOTE:</strong> The fake backend displayed this "email" so you can test without an api. A real backend would send a real email.</div>`,
                        { autoClose: false });
                }, 1000);
        
                // always return ok() response to prevent email enumeration
                return ok();
            }
        
            // assign account id and a few other properties then save
            account.id = newAccountId();
            if (account.id === 1) {
                // first registered account is an admin
                account.role = Role.Admin;
            } else {
                account.role = Role.User;
            }
            account.dateCreated = new Date().toISOString();
            account.verificationToken = new Date().getTime().toString();
            account.isVerified = false;
            account.refreshTokens = [];
            account.isActive = true; // <--- Add this line
            delete account.confirmPassword;
            accounts.push(account);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
        
            // display verification email in alert
            setTimeout(() => {
                const verifyUrl = `${location.origin}/account/verify-email?token=${account.verificationToken}`;
                alertService.info(`
                    <h4>Verification Email</h4>
                    <p>Thanks for registering!</p>
                    <p>Please click the below link to verify your email address:</p>
                    <p><a href="${verifyUrl}">${verifyUrl}</a></p>
                    <div><strong>NOTE:</strong> The fake backend displayed this "email" so you can test without an api. A real backend would send a real email.</div>
                `, { autoClose: false });
            }, 1000);

            return ok();
        }

        function verifyEmail() {
            const { token } = body;
            const account = accounts.find(x => x.verificationToken && x.verificationToken === token);

            if (!account) return error('Verification failed');

            // set is verified flag to true if token is valid
            account.isVerified = true;
            delete account.verificationToken; // Remove the token after verification
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            return ok();
        }

        function forgotPassword() {
            const { email } = body;
            const account = accounts.find(x => x.email === email);
        
            // always return ok() response to prevent email enumeration
            if (!account) return ok();
        
            // create reset token that expires after 24 hours
            account.resetToken = new Date().getTime().toString();
            account.resetTokenExpires = new Date(Date.now() + 24*60*60*1000).toISOString();
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
        
            // display password reset email in alert
            setTimeout(() => {
                const resetUrl = `${location.origin}/account/reset-password?token=${account.resetToken}`;
                alertService.info(
                    `<h4>Reset Password Email</h4>
                    <p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                    <p><a href="${resetUrl}">${resetUrl}</a></p>
                    <div><strong>NOTE:</strong> The fake backend displayed this "email" so you can test without an api. A real backend would send a real email.</div>`,
                    { autoClose: false });
            }, 1000);
        
            return ok();
        }
        
        function validateResetToken() {
            const { token } = body;
        
            const account = accounts.find(x =>
                x.resetToken === token &&
                new Date() < new Date(x.resetTokenExpires)
            );
        
            if (!account) return error('Invalid or expired token');
        
            return ok();
        }
        
        
        function resetPassword() {
            const { token, password } = body;
            const account = accounts.find(x => 
                !!x.resetToken && x.resetToken === token &&
                new Date() < new Date(x.resetTokenExpires)
            );

            if (!account) return error('Invalid token');

            // update password and remove reset token
            account.password = password;
            account.isVerified = true;
            delete account.resetToken;
            delete account.resetTokenExpires;
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            return ok();
        }

        function getAccounts() {
            if (!isAuthenticated()) return unauthorized();
            return ok(accounts.map(x => basicDetails(x)));
        }

        function getAccountById() {
            if (!isAuthenticated()) return unauthorized();

            let account = accounts.find(x => x.id === idFromUrl());

            // user accounts can get own profile and admin accounts can get all profiles
            if (account.id !== currentAccount().id && !isAuthorized(Role.Admin)) {
                return unauthorized();
            }

            return ok(basicDetails(account));
        }

        function createAccount() {
            if (!isAuthorized(Role.Admin)) return unauthorized();

            const account = body;
            if (accounts.find(x => x.email === account.email)) {
                return error(`Email ${account.email} is already registered`);
            }

            // assign account id and a few other properties then save
            account.id = newAccountId();
            account.dateCreated = new Date().toISOString();
            account.isVerified = true;
            account.refreshTokens = [];
            account.isActive = true; // <--- Add this line
            delete account.confirmPassword;
            accounts.push(account);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            return ok();
        }

        function updateAccount() {
            if (!isAuthenticated()) return unauthorized();

            let params = body;
            let account = accounts.find(x => x.id === idFromUrl());

            // user accounts can update own profile and admin accounts can update all profiles
            if (account.id !== currentAccount().id && !isAuthorized(Role.Admin)) {
                return unauthorized();
            }

            // only update password if included
            if (!params.password) {
                delete params.password;
            }
            // don't save confirm password
            delete params.confirmPassword;

            // update and save account
            Object.assign(account, params);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            return ok(basicDetails(account));
        }

        function toggleAccountStatus() {
            if (!isAuthorized(Role.Admin)) return unauthorized();
        
            const account = accounts.find(x => x.id === idFromUrl());
            if (!account) return error('Account not found');
        
            account.isActive = !account.isActive; // Toggle activation status
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            
            return ok({ id: account.id, isActive: account.isActive });
        }
        

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
                .pipe(delay(500)); // delay observable to simulate server api call
        }

        function error(message) {
            return throwError({ error: { message } })
                .pipe(materialize(), delay(500), dematerialize());
            // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/6487)
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorized' } })
                .pipe(materialize(), delay(500), dematerialize());
        }

        function basicDetails(account) {
            const { id, title, firstName, lastName, email, role, dateCreated, isVerified, isActive } = account;
            return { id, title, firstName, lastName, email, role, dateCreated, isVerified, isActive };

        }

        function isAuthenticated() {
            return !!currentAccount();
        }

        function isAuthorized(role: string) {
            const account = currentAccount();
            if (!account) return false;
            return account.role === role;
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            const idPart = urlParts.find(part => /^\d+$/.test(part));
            return parseInt(idPart);
        }
        

        function newAccountId() {
            return accounts.length ? Math.max(...accounts.map(x => x.id)) + 1 : 1;
        }

        function currentAccount() {
            // check if jwt token is in auth header
            const authHeader = headers.get('Authorization');
            if (!authHeader?.startsWith('Bearer fake-jwt-token')) return;

            // check if token is expired
            const jwtToken = JSON.parse(atob(authHeader.split('.')[1]));
            const tokenExpired = Date.now() > (jwtToken.exp * 1000);
            if (tokenExpired) return;

            const account = accounts.find(x => x.id === jwtToken.id);
            return account;
        }

        function generateJwtToken(account) {
            // create token that expires in 15 minutes
            const tokenPayload = {
                exp: Math.round(new Date(Date.now() + 15*60*1000).getTime() / 1000),
                id: account.id
            }
            return `fake-jwt-token.${btoa(JSON.stringify(tokenPayload))}`;
        }

        function generateRefreshToken() {
            const token = new Date().getTime().toString();

            // add token cookie that expires in 7 days
            const expires = new Date(Date.now() + 7*24*60*60*1000).toUTCString();
            document.cookie = `fakeRefreshToken=${token}; expires=${expires}; path=/`;

            return token;
        }

        function getRefreshToken() {
            // get refresh token from cookie
            return (document.cookie.split(';').find(x => x.includes('fakeRefreshToken')) || '').split('=')[1];
        }
    }
}
    
export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};