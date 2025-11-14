require("dotenv").config();

module.exports = {
	jwtSecret: process.env.JWT_SECRET,
	jwtExpiration: process.env.JWT_EXPIRATION || "24h",
	bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
};
