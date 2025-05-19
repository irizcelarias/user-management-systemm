const db = require('../_helpers/db');

module.exports = {
    create,
    getByEmployee,
    updateStatus
};

async function create(params) {
    const [result] = await db.query(
        `INSERT INTO workflows (employeeId, type, status, details) VALUES (?, ?, ?, ?)`,
        [params.employeeId, params.type, 'Pending', JSON.stringify(params.details || {})]
    );
    return result;
}

async function getByEmployee(employeeId) {
    return db.query(`SELECT * FROM workflows WHERE employeeId = ?`, [employeeId]);
}

async function updateStatus(id, status) {
    await db.query(`UPDATE workflows SET status = ? WHERE id = ?`, [status, id]);
    return { message: 'Status updated' };
}
