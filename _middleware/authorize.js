const { expressjwt } = require("express-jwt");
const { secret } = require('../config.json');
const db = require('../_helpers/db');

module.exports = authorize;

function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        expressjwt({ 
            secret, 
            algorithms: ['HS256'] 
        }),

        async (req, res, next) => {
            try {
                const account = await db.Account.findByPk(req.auth.id);

                if (!account || (roles.length && !roles.includes(account.role))) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }

                req.user = req.auth;
                req.user.role = account.role;
                const refreshTokens = await account.getRefreshTokens();
                req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token);
                next();
            } catch (err) {
                console.error('Authorization error:', err);
                return res.status(401).json({ message: 'Authorization failed', error: err.message });
            }
        }
    ];
}