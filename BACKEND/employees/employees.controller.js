const express = require('express');
const router = express.Router();
const employeeService = require('./employee.model');
const authorize = require('../_middleware/authorize');
const Role = require('../_helpers/role');

router.post('/', authorize(Role.Admin), create);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(Role.Admin), update);
router.delete('/:id', authorize(Role.Admin), _delete);
router.post('/:id/transfer', authorize(Role.Admin), transfer);

module.exports = router;

async function create(req, res, next) {
    try {
        res.json(await employeeService.create(req.body));
    } catch (err) {
        next(err);
    }
}

async function getAll(req, res, next) {
    try {
        res.json(await employeeService.getAll());
    } catch (err) {
        next(err);
    }
}

async function getById(req, res, next) {
    try {
        res.json(await employeeService.getById(req.params.id));
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        res.json(await employeeService.update(req.params.id, req.body));
    } catch (err) {
        next(err);
    }
}

async function _delete(req, res, next) {
    try {
        await employeeService.delete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        next(err);
    }
}

async function transfer(req, res, next) {
    try {
        await employeeService.transfer(req.params.id, req.body.departmentId);
        res.json({ message: 'Transferred' });
    } catch (err) {
        next(err);
    }
}
