const express = require('express');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

	if (req.method === 'OPTIONS') {
		return res.sendStatus(200);
	}
	next();
});

if (process.env.NODE_ENV === 'development') {
	app.use((req, res, next) => {
		console.log(`${ req.method } ${ req.path }`)
		next();
	});
}

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
