const express = require('express');
const router = express.Router();
const workflowService = require('./workflow.model');
const authorize = require('../_middleware/authorize');
const Role = require('../_helpers/role');

router.post('/', authorize(Role.Admin), create);
router.get('/employee/:employeeId', authorize(), getByEmployee);
router.put('/:id/status', authorize(Role.Admin), updateStatus);

module.exports = router;

async function create(req, res, next) {
    try {
        res.json(await workflowService.create(req.body));
    } catch (err) {
        next(err);
    }
}

async function getByEmployee(req, res, next) {
    try {
        res.json(await workflowService.getByEmployee(req.params.employeeId));
    } catch (err) {
        next(err);
    }
}

async function updateStatus(req, res, next) {
    try {
        res.json(await workflowService.updateStatus(req.params.id, req.body.status));
    } catch (err) {
        next(err);
    }
}
