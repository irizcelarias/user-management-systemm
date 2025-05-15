const express = require('express');
const router = express.Router();
const departmentService = require('./department.model');
const authorize = require('../_middleware/authorize');
const Role = require('../_helpers/role');

router.post('/', authorize(Role.Admin), create);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(Role.Admin), update);
router.delete('/:id', authorize(Role.Admin), _delete);

module.exports = router;

async function create(req, res, next) {
    try {
        res.json(await departmentService.create(req.body));
    } catch (err) {
        next(err);
    }
}

async function getAll(req, res, next) {
    try {
        res.json(await departmentService.getAll());
    } catch (err) {
        next(err);
    }
}

async function getById(req, res, next) {
    try {
        res.json(await departmentService.getById(req.params.id));
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        res.json(await departmentService.update(req.params.id, req.body));
    } catch (err) {
        next(err);
    }
}

async function _delete(req, res, next) {
    try {
        await departmentService.delete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        next(err);
    }
}
