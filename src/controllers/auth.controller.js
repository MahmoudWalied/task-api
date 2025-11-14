const authService = require("../services/auth.service");
const { successResponse, errorResponse } = require("../utils/response.util");

class AuthController {
	async register(req, res) {
		try {
			const { username, email, password } = req.body;
			const user = await authService.register(username, email, password);
			return successResponse(
				res,
				user,
				"User registered successfully",
				201
			);
		} catch (error) {
			return errorResponse(res, error.message, 400);
		}
	}

	async login(req, res) {
		try {
			const { email, password } = req.body;
			const user = await authService.login(email, password);
			return successResponse(res, user, "User logged in successfully");
		} catch (error) {
			return errorResponse(res, error.message, 401);
		}
	}

	async getProfile(req, res) {
		try {
			const user = await authService.getUserById(req.user.userId);
			return successResponse(res, user, "Profile returned successfully");
		} catch (error) {
			return errorResponse(res, error.message, 401);
		}
	}

	async logout(req, res) {
		try {
			const result = await authService.logout(req.token);
			return successResponse(res, result, "User logged out successfully");
		} catch (error) {
			return errorResponse(res, error.message, 400);
		}
	}
}

module.exports = new AuthController();
