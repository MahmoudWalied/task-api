require('dotenv').config();
const app = require('./src/app');
const db = require('./src/models');

const port = process.env.PORT || 3000;

const connectDatabase = async () => {
	try {
		await db.sequelize.authenticate();
		console.log('Database Connected');

		if (process.env.NODE_ENV === 'development') {
			await db.sequelize.sync({ alter: true });
			console.log('Database synchronized');
		}
		return true;
	} catch (error) {
		console.error('Unable to connect to database:', error.message);
		return false;
	}
};

const startServer = async () => {
	const isDbConnected = await connectDatabase();
	if (!isDbConnected) {
		console.error('Server not started due to database connection failure');
		process.exit(1);
	}

	app.listen(port, () => {
		console.log(`Server is running on port ${port}`);
		console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
		console.log(`API Base URL: http://localhost:${port}/api`);
	});
};

process.on('uncaughtException', (err) => {
	console.error('Uncaught Exception: ', err);
	process.exit(1);
})

process.on('unhandledRejection', (err) => {
	console.error('Unhandled Rejection: ', err);
	process.exit(1);
})

startServer();