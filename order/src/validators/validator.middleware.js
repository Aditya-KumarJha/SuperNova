const { body, validationResult } = require('express-validator');

const respondWithValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const createOrderValidation = [
    body('shippingAddress.street')
        .isString()
        .withMessage('Street must be a string')
        .notEmpty()
        .withMessage('Street is required'),
    body('shippingAddress.city')
        .isString()
        .withMessage('City must be a string')
        .notEmpty()
        .withMessage('City is required'),
    body('shippingAddress.state')
        .isString()
        .withMessage('State must be a string')
        .notEmpty()
        .withMessage('State is required'),
    body('shippingAddress.zip')
        .isString()
        .withMessage('Zip must be a string')
        .notEmpty()
        .withMessage('Zip is required')
        .bail()
        .matches(/^\d{4,}$/)
        .withMessage('Zip must be at least 4 digits'),
    body('shippingAddress.country')
        .isString()
        .withMessage('Country must be a string')
        .notEmpty()
        .withMessage('Country is required'),
    body('shippingAddress.phone')
        .optional()
        .isString()
        .withMessage('Phone must be a string')
        .bail()
        .matches(/^\d{10}$/)
        .withMessage('Phone must be a valid 10-digit number'),
    respondWithValidationErrors
];

const updateAddressValidation = [
    body('shippingAddress.street')
        .isString()
        .withMessage('Street must be a string')
        .notEmpty()
        .withMessage('Street cannot be empty'),
    body('shippingAddress.city')
        .isString()
        .withMessage('City must be a string')
        .notEmpty()
        .withMessage('City cannot be empty'),
    body('shippingAddress.state')
        .isString()
        .withMessage('State must be a string')
        .notEmpty()
        .withMessage('State cannot be empty'),
    body('shippingAddress.zip')
        .isString()
        .withMessage('Zip must be a string')
        .notEmpty()
        .withMessage('Zip cannot be empty')
        .bail()
        .matches(/^\d{4,}$/)
        .withMessage('Zip must be at least 4 digits'),
    body('shippingAddress.country')
        .isString()
        .withMessage('Country must be a string')
        .notEmpty()
        .withMessage('Country cannot be empty'),
    respondWithValidationErrors
];

module.exports = {
    createOrderValidation,
    updateAddressValidation
};
