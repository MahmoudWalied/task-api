const authService = require("../services/auth.service");
const { errorResponse } = require("../utils/response.util");

const authMiddleware = (req, res, next) => {
	try {
		const authHeader = req.get("Authorization");

		if (!authHeader) {
			return errorResponse(
				res,
				"No token provided, authorization denied",
				401
			);
		}

		if (!authHeader.startsWith("Bearer ")) {
			return errorResponse(
				res,
				"Invalid token format. Use: Bearer <token>",
				401
			);
		}

		const token = authHeader.substring(7);
		if (!token) {
			return errorResponse(
				res,
				"No token provided, authorization denied",
				401
			);
		}

		const decoded = authService.verifyToken(token);
		req.token = token;
		req.user = decoded;
		next();
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return errorResponse(res, "Token has expired", 401);
		}
		if (error.name === "JsonWebTokenError") {
			return errorResponse(res, "Invalid token", 401);
		}
		if (error.name === "TokenRevokedError") {
			return errorResponse(res, "Token has been revoked", 401);
		}
		return errorResponse(res, "Token Verification failed", 401);
	}
};

module.exports = authMiddleware;
