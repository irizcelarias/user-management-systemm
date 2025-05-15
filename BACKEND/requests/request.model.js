const db = require('../_helpers/db');

module.exports = {
    create,
    getAll,
    getById,
    getByEmployee,
    update,
    delete: _delete
};

async function create(params) {
    const [result] = await db.query(
        `INSERT INTO requests (employeeId, type, status) VALUES (?, ?, ?)`,
        [params.employeeId, params.type, 'Pending']
    );

    const requestId = result.insertId;
    for (const item of params.items) {
        await db.query(
            `INSERT INTO request_items (requestId, name, quantity) VALUES (?, ?, ?)`,
            [requestId, item.name, item.quantity]
        );
    }

    return { id: requestId, message: 'Request created' };
}

async function getAll() {
    return db.query(`SELECT * FROM requests`);
}

async function getById(id) {
    const [requests] = await db.query(`SELECT * FROM requests WHERE id = ?`, [id]);
    const [items] = await db.query(`SELECT * FROM request_items WHERE requestId = ?`, [id]);
    return { ...requests[0], items };
}

async function getByEmployee(employeeId) {
    return db.query(`SELECT * FROM requests WHERE employeeId = ?`, [employeeId]);
}

async function update(id, params) {
    await db.query(`UPDATE requests SET type = ?, status = ? WHERE id = ?`, [params.type, params.status, id]);
    return { message: 'Request updated' };
}

async function _delete(id) {
    await db.query(`DELETE FROM request_items WHERE requestId = ?`, [id]);
    await db.query(`DELETE FROM requests WHERE id = ?`, [id]);
}
