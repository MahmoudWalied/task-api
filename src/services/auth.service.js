const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/user.repository");
const authConfig = require("../config/auth");

const revokedTokens = new Map();

class AuthService {
	_cleanupRevokedTokens() {
		const now = Date.now();
		for (const [token, expiry] of revokedTokens.entries()) {
			if (expiry <= now) {
				revokedTokens.delete(token);
			}
		}
	}

	isTokenRevoked(token) {
		this._cleanupRevokedTokens();
		return revokedTokens.has(token);
	}

	async register(username, email, password) {
		const existingUser = await userRepository.findByEmailOrUsername(
			email,
			username
		);
		if (existingUser) {
			if (existingUser.email === email) {
				throw new Error("Email already exists");
			}
			if (existingUser.username === username) {
				throw new Error("Username already exists");
			}
		}

		const salt = await bcrypt.genSalt(authConfig.bcryptSaltRounds);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = await userRepository.create({
			username,
			email,
			password: hashedPassword,
		});

		return {
			id: user.id,
			username: user.username,
			email: user.email,
		};
	}

	async login(email, password) {
		const user = await userRepository.findByEmail(email);
		if (!user) {
			throw new Error("Invalid credentials");
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new Error("Invalid credentials");
		}

		const token = jwt.sign(
			{
				userId: user.id,
				username: user.username,
				email: user.email,
			},
			authConfig.jwtSecret,
			{ expiresIn: authConfig.jwtExpiration }
		);

		return {
			token: token,
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
			},
		};
	}

	verifyToken(token) {
		const decoded = jwt.verify(token, authConfig.jwtSecret);
		if (this.isTokenRevoked(token)) {
			const error = new Error("Token has been revoked");
			error.name = "TokenRevokedError";
			throw error;
		}
		return decoded;
	}

	async getUserById(userId) {
		const user = await userRepository.findById(userId);
		if (!user) {
			throw new Error("user not found");
		}
		return user;
	}

	async logout(token) {
		try {
			const decoded = this.verifyToken(token);
			const expiryTimestamp = decoded.exp
				? decoded.exp * 1000
				: Date.now();
			revokedTokens.set(token, expiryTimestamp);
			this._cleanupRevokedTokens();
			return { revokedAt: new Date().toISOString() };
		} catch (error) {
			if (error.name === "TokenRevokedError") {
				return { revokedAt: new Date().toISOString() };
			}
			if (error.name === "TokenExpiredError") {
				return { revokedAt: new Date().toISOString() };
			}
			throw new Error("Invalid or expired token");
		}
	}
}

module.exports = new AuthService();
