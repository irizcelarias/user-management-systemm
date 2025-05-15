const express = require('express');
const router = express.Router();
const requestService = require('./request.model');
const authorize = require('../_middleware/authorize');
const Role = require('../_helpers/role');

router.post('/', authorize(), create);
router.get('/', authorize(Role.Admin), getAll);
router.get('/:id', authorize(), getById);
router.get('/employee/:employeeId', authorize(), getByEmployee);
router.put('/:id', authorize(Role.Admin), update);
router.delete('/:id', authorize(Role.Admin), _delete);

module.exports = router;

async function create(req, res, next) {
    try {
        res.json(await requestService.create(req.body));
    } catch (err) {
        next(err);
    }
}

async function getAll(req, res, next) {
    try {
        res.json(await requestService.getAll());
    } catch (err) {
        next(err);
    }
}

async function getById(req, res, next) {
    try {
        res.json(await requestService.getById(req.params.id));
    } catch (err) {
        next(err);
    }
}

async function getByEmployee(req, res, next) {
    try {
        res.json(await requestService.getByEmployee(req.params.employeeId));
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        res.json(await requestService.update(req.params.id, req.body));
    } catch (err) {
        next(err);
    }
}

async function _delete(req, res, next) {
    try {
        await requestService.delete(req.params.id);
        res.json({ message: 'Request deleted' });
    } catch (err) {
        next(err);
    }
}
