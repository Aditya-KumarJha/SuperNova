const jwt = require('jsonwebtoken');

function getAuthCookie({ userId = '690369509580b0c027b359ac', extra = { role: "user" } } = {}) {
    const secret = process.env.JWT_SECRET || 'test-secret';
    const payload = { id: userId, ...extra };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    const cookieName = process.env.JWT_COOKIE_NAME || 'token';
    return [ `${cookieName}=${token}` ];
}

module.exports = { getAuthCookie };
