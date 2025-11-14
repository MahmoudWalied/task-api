const { body, query, validationResult } = require("express-validator");

const validateCreateTask = [
	body("title")
		.trim()
		.notEmpty()
		.withMessage("Title is required")
		.isLength({ min: 1, max: 255 })
		.withMessage("Title must be between 1 and 255 characters"),

	body("description")
		.optional()
		.trim()
		.isLength({ max: 5000 })
		.withMessage("Description must be less than 5000 characters"),

	body("status")
		.optional()
		.trim()
		.toLowerCase()
		.isIn(["pending", "in-progress", "completed"])
		.withMessage("Status must be pending, in-progress, or completed"),
];

const validateUpdateTask = [
	body("title")
		.optional()
		.trim()
		.notEmpty()
		.withMessage("Title cannot be empty")
		.isLength({ min: 1, max: 255 })
		.withMessage("Title must be between 1 and 255 characters"),

	body("description")
		.optional()
		.trim()
		.isLength({ max: 5000 })
		.withMessage("Description must be less than 5000 characters"),

	body("status")
		.optional()
		.trim()
		.toLowerCase()
		.isIn(["pending", "in-progress", "completed"])
		.withMessage("Status must be pending, in-progress, or completed"),
];

const validateQueryFilters = [
	query("status")
		.optional()
		.trim()
		.toLowerCase()
		.isIn(["pending", "in-progress", "completed"])
		.withMessage("Status must be pending, in-progress, or completed"),
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
	validateCreateTask: [...validateCreateTask, handleValidationErrors],
	validateUpdateTask: [...validateUpdateTask, handleValidationErrors],
	validateQueryFilters: [...validateQueryFilters, handleValidationErrors],
};
