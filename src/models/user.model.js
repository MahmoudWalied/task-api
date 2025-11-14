module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		"User",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			username: {
				type: DataTypes.STRING(50),
				allowNull: false,
				unique: {
					field: "username",
					msg: "username already exists",
				},
				validate: {
					len: {
						args: [3, 50],
						msg: "Username must be between 3 and 50 characters",
					},
				},
			},
			email: {
				type: DataTypes.STRING(100),
				allowNull: false,
				unique: {
					name: "email",
					msg: "Email already exists",
				},
				validate: {
					isEmail: {
						msg: "must be a valid email address",
					},
				},
			},
			password: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
		},
		{
			timestamps: true,
			tableName: "users",
			indexes: [
				{
					unique: true,
					fields: ["email"],
				},
				{
					unique: true,
					fields: ["username"],
				},
			],
		}
	);

	User.associate = (models) => {
		User.hasMany(models.Task, {
			foreignKey: {
				name: "userId",
				field: "user_id",
			},
			as: "tasks",
			onDelete: "CASCADE",
		});
	};

	return User;
};
