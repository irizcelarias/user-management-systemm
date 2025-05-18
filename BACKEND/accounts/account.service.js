const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Op } = require('sequelize');
const sendEmail = require('../_helpers/send-email');
const db = require('../_helpers/db');
const Role = require('../_helpers/role');

module.exports = {
    authenticate,
    refreshToken,
    revokeToken,
    register,
    verifyEmail,
    forgotPassword,
    validateResetToken,
    resetPassword,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ email, password, ipAddress }) {
    const account = await db.Account.scope('withHash').findOne({ where: { email } });

    if (!account || !(await bcrypt.compare(password, account.passwordHash))) {
        throw 'Login failed. Please check your details.';
    }

    if (!account.isVerified) {
        throw 'Your account is not yet verified.';
    }

    const jwtToken = generateJwtToken(account);
    const refreshToken = generateRefreshToken(account, ipAddress);
    await refreshToken.save();

    return {
        ...basicDetails(account),
        jwtToken,
        refreshToken: refreshToken.token
    };
}

async function refreshToken({ token, ipAddress }) {
    const refreshToken = await getRefreshToken(token);
    const account = await refreshToken.getAccount();

    const newToken = generateRefreshToken(account, ipAddress);
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newToken.token;

    await refreshToken.save();
    await newToken.save();

    const jwtToken = generateJwtToken(account);
    return {
        ...basicDetails(account),
        jwtToken,
        refreshToken: newToken.token
    };
}

async function revokeToken({ token, ipAddress }) {
    const refreshToken = await getRefreshToken(token);
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    await refreshToken.save();
}

async function register(params, origin) {
    if (await db.Account.findOne({ where: { email: params.email } })) {
        return await sendAlreadyRegisteredEmail(params.email, origin);
    }

    const account = new db.Account(params);
    const isFirst = (await db.Account.count()) === 0;
    account.role = isFirst ? Role.Admin : Role.User;
    account.verified = isFirst ? new Date() : undefined;
    account.verificationToken = isFirst ? undefined : randomTokenString();
    account.passwordHash = await hash(params.password);
    await account.save();

    if (!isFirst) {
        await sendVerificationEmail(account, origin);
    }

    return account;
}

async function verifyEmail({ token }) {
    const account = await db.Account.findOne({ where: { verificationToken: token } });
    if (!account) throw 'Verification failed. Please try again or contact support.';

    account.verified = Date.now();
    account.verificationToken = null;
    await account.save();
}

async function forgotPassword({ email }, origin) {
    const account = await db.Account.findOne({ where: { email } });
    if (!account) return;

    account.resetToken = randomTokenString();
    account.resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await account.save();
    await sendPasswordResetEmail(account, origin);
}

async function validateResetToken({ token }) {
    const account = await db.Account.findOne({
        where: {
            resetToken: token,
            resetTokenExpires: { [Op.gt]: Date.now() }
        }
    });

    if (!account) throw 'Token is not valid or has expired.';
    return account;
}

async function resetPassword({ token, password }) {
    const account = await validateResetToken({ token });
    account.passwordHash = await hash(password);
    account.passwordReset = Date.now();
    account.resetToken = null;
    await account.save();
}

async function getAll() {
    const accounts = await db.Account.findAll();
    return accounts.map(x => basicDetails(x));
}

async function getById(id) {
    const account = await getAccount(id);
    return basicDetails(account);
}

async function create(params) {
    if (await db.Account.findOne({ where: { email: params.email } })) {
        throw 'This email is already in use.';
    }

    const account = new db.Account(params);
    account.verified = Date.now();
    account.passwordHash = await hash(params.password);
    await account.save();

    return basicDetails(account);
}

async function update(id, params) {
    const account = await getAccount(id);

    if (params.email && account.email !== params.email &&
        await db.Account.findOne({ where: { email: params.email } })) {
        throw 'This email is already in use.';
    }

    if (params.password) {
        params.passwordHash = await hash(params.password);
    }

    Object.assign(account, params);
    account.updated = Date.now();
    await account.save();

    return basicDetails(account);
}

async function _delete(id) {
    const account = await getAccount(id);
    await account.destroy();
}

async function getAccount(id) {
    const account = await db.Account.findByPk(id);
    if (!account) throw 'Unable to process your request at this time.';
    return account;
}

async function getRefreshToken(token) {
    const refreshToken = await db.RefreshToken.findOne({ where: { token } });
    if (!refreshToken || !refreshToken.isActive) throw 'Token is not valid or has expired.';
    return refreshToken;
}

function generateJwtToken(account) {
    return jwt.sign({ sub: account.id, id: account.id }, config.secret, { expiresIn: '15m' });
}

function generateRefreshToken(account, ipAddress) {
    return new db.RefreshToken({
        accountId: account.id,
        token: randomTokenString(),
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdByIp: ipAddress
    });
}

async function hash(password) {
    return await bcrypt.hash(password, 10);
}

function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}

function basicDetails(account) {
    const { id, title, firstName, lastName, email, role, created, updated, isVerified, status } = account;
    return { id, title, firstName, lastName, email, role, created, updated, isVerified, status };
}

async function sendVerificationEmail(account, origin) {
    const link = origin
        ? `${origin}/account/verify-email?token=${account.verificationToken}`
        : null;

    const msg = origin
        ? `<p>Click the button or link below to verify your email address:</p><p><a href="${link}">${link}</a></p>`
        : `<p>Use the following token with the /account/verify-email API route:</p><code>${account.verificationToken}</code>`;

    await sendEmail({
        to: account.email,
        subject: 'Verify Your Account',
        html: `<h4>Email Verification</h4>${msg}`
    });
}

async function sendAlreadyRegisteredEmail(email, origin) {
    const msg = origin
        ? `<p>If you already have an account and need access, you may reset your password here:</p><p><a href="${origin}/account/forgot-password">Reset Password</a></p>`
        : `<p>If you already have an account, you can reset your password using the /account/forgot-password API route.</p>`;

    await sendEmail({
        to: email,
        subject: 'Account Notification',
        html: `<h4>Notice</h4><p>If you recently tried to register, and already have an account associated with this email, you may reset your password instead.</p>${msg}`
    });
}

async function sendPasswordResetEmail(account, origin) {
    const resetLink = `${origin}/account/reset-password?token=${account.resetToken}`;
    const message = `<p>Please click the link below to reset your password. This link will expire after 24 hours.</p><p><a href="${resetLink}">${resetLink}</a></p>`;

    await sendEmail({
        to: account.email,
        subject: 'Reset Password Request',
        html: `<h4>Password Reset</h4>${message}`
    });
}