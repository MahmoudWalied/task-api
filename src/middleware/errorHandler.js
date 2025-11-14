const errorHandler = (err, req, res, next) => {
	console.log(err);

	if (err.name === "SequelizeValidationError") {
		return res.status(400).json({
			success: false,
			message: 'Validation error',
			errors: err.errors.map(e => ({
				field: e.path,
				message: e.message,
			}))
		})
	}

	if (err.name === "SequelizeUniqueConstraintError") {
		return res.status(400).json({
			success: false,
			message: 'Duplicate entry',
			errors: err.errors.map(e => ({
				field: e.path,
				message: e.message,
			}))
		});
	}

	if (err.name === "SequelizeDatabaseError") {
		return res.status(500).json({
			success: false,
			message: 'Database error occurred',
		});
	}

	if (err.name === "SequelizeConnectionError") {
		return res.status(503).json({
			success: false,
			message: 'Connection error',
		});
	}

	if (err.name === "JsonWebTokenError") {
		return res.status(401).json({
			success: false,
			message: 'Invalid Token',
		});
	}

	if (err.name === "TokenExpiredError") {
		return res.status(401).json({
			success: false,
			message: 'Token expired',
		});
	}

	res.status(err.statusCode || 500).json({
		success: false,
		message: err.message || 'Internal Server Error',
	});
}

module.exports = errorHandler;