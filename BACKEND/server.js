require('rootpath')();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Allow CORS from any origin with credentials
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

// API routes
app.use('/accounts', require('./accounts/accounts.controller'));
app.use('/employees', require('./employees/employees.controller'));
app.use('/departments', require('./departments/departments.controller'));
app.use('/workflows', require('./workflows/workflows.controller'));
app.use('/requests', require('./requests/requests.controller'));

// Swagger docs
app.use('/api-docs', require('_helpers/swagger'));

// Global error handler
app.use(errorHandler);

// Start server
const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Server listening on port ' + port));
