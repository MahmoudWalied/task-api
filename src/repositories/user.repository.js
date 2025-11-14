const { User } = require("../models");
const { Op } = require("sequelize");

class UserRepository {
	async findById(id) {
		return await User.findByPk(id, {
			attributes: { exclude: ["password"] },
		});
	}

	async findByEmail(email) {
		return await User.findOne({ where: { email } });
	}

	async findByEmailOrUsername(email, username) {
		return await User.findOne({
			where: {
				[Op.or]: [{ email }, { username }],
			},
		});
	}

	async create(userData) {
		return await User.create(userData);
	}

	async update(id, userData) {
		const user = await User.findByPk(id);
		if (!user) return null;
		return await user.update(userData);
	}

	async delete(id) {
		const user = await User.findByPk(id);
		if (!user) return null;
		await user.destroy();
		return true;
	}
}

module.exports = new UserRepository();
