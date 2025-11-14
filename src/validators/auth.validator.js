const { body, validationResult } = require("express-validator");

const validateRegister = [
	body("username")
		.trim()
		.notEmpty()
		.withMessage("Username is required")
		.isLength({ min: 3, max: 50 })
		.withMessage("Username must be between 3 and 50 characters")
		.matches(/^[a-zA-Z0-9_-]+$/)
		.withMessage(
			"Username can only contain letters, numbers, digits, and underscore"
		),

	body("email")
		.trim()
		.notEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Email address is required")
		.normalizeEmail(),

	body("password")
		.trim()
		.notEmpty()
		.withMessage("Password is required")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters")
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
		.withMessage(
			"Password must contain at least one uppercase letter, one lowercase letter, and one number"
		),
];

const validateLogin = [
	body("email")
		.trim()
		.notEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("must be a valid email address")
		.normalizeEmail(),

	body("password").trim().notEmpty().withMessage("Password is required"),
];

const handleValidationErrors = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			success: false,
			message: "Validation error",
			errors: errors.array().map((err) => ({
				field: err.path,
				message: err.msg,
			})),
		});
	}
	next();
};

module.exports = {
	validateRegister: [...validateRegister, handleValidationErrors],
	validateLogin: [...validateLogin, handleValidationErrors],
};
