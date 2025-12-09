const express = require('express');
const { registerUserValidations, loginUserValidations, addUserAddressValidations } = require('../middleware/validator.middleware');
const { registerUser, loginUser, getCurrentUser, logoutUser, getUserAddress, addUserAddress, deleteUserAddress } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware')

const router = express.Router();

router.post('/register', registerUserValidations, registerUser);

router.post('/login', loginUserValidations, loginUser);

router.get('/me', authMiddleware, getCurrentUser);

router.get('/logout', logoutUser);

router.get('/users/me/addresses', authMiddleware, getUserAddress);

router.post('/users/me/addresses', addUserAddressValidations, authMiddleware, addUserAddress);

router.delete('/users/me/addresses/:addressId', authMiddleware, deleteUserAddress);

module.exports = router;
