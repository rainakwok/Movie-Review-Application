import mysql from 'mysql';
import config from './config.js';
import fetch from 'node-fetch';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import response from 'express';
import e from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, "client/build")));


app.post('/api/loadUserSettings', (req, res) => {

	let connection = mysql.createConnection(config);
	let userID = req.body.userID;

	let sql = `SELECT mode FROM user WHERE userID = ?`;
	console.log(sql);
	let data = [userID];
	console.log(data);

	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}

		let string = JSON.stringify(results);
		//let obj = JSON.parse(string);
		res.send({ express: string });
	});
	connection.end();
});

app.post('/api/getMovies', (req, res) => {
	let connection = mysql.createConnection(config);
	let sql = `SELECT * FROM movies`;

	connection.query(sql, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}

		let string = JSON.stringify(results);
		res.send({ express: string });
	});
	connection.end();
});

app.post('/api/addReview', (req, res) => {

    const { movieID, userID, reviewTitle, reviewContent, reviewScore } = req.body;
	let data = [movieID, userID, reviewTitle, reviewContent, reviewScore];
	console.log("Data to record: " + data);

	let connection = mysql.createConnection(config);
	let sql = `INSERT INTO review (movie_id, userID, reviewTitle, reviewContent, reviewScore)
	VALUES (?, ?, ?, ?, ?)`;

	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			res.send('Error');
			return console.error(error.message);
		}
		console.log("Review record " + data + " inserted");
		let string = JSON.stringify("Success");
		res.send({ express: string });
	});
	connection.end();
});


app.post('/api/searchMovies', (req, res) => {

    const { movieName, actorName, directorName } = req.body;
	let actorFirst = actorName;
	let actorLast = '';
	let directorFirst = directorName
	let directorLast = '';

	// Get first and last names of actor and director
	let actorArr = actorName.split(/\s+/);
	let directorArr = directorName.split(/\s+/);
	if (actorArr.length > 1){
		actorArr[1] = actorArr.slice(1).join(' ');
		actorFirst = actorArr[0];
		actorLast = actorArr[1];
	} 
	if (directorArr.length > 1){
		directorArr[1] = directorArr.slice(1).join(' ');
		directorFirst = directorArr[0];
		directorLast = directorArr[1];
	}

	let connection = mysql.createConnection(config);

	let data = [movieName, actorFirst, actorLast, directorFirst, directorLast];
	console.log(data);

	let sqlExtra = [`WHERE M.name = ?`, `AND A.first_name = ?`, `AND A.last_name = ?`,
		`AND D.first_name = ?`, `AND D.last_name = ?`];	
	if (!movieName){
		data[0] = '%'
		sqlExtra[0] = `WHERE M.name LIKE ?`;
	}
	if (!actorFirst){
		data[1] = '%'
		sqlExtra[1] = `AND A.first_name LIKE ?`;
	}
	if (!actorLast){
		data[2] = '%'
		sqlExtra[2] = `AND A.last_name LIKE ?`;
	}
	if (!directorFirst){
		data[3] = '%'
		sqlExtra[3] = `AND D.first_name LIKE ?`;
	}
	if (!directorLast){
		data[4] = '%'
		sqlExtra[4] = `AND D.last_name LIKE ?`;
	}
	console.log("newData: " + data);
	console.log("sqlExtra: " + sqlExtra);

	let sql = `SELECT main.movie, main.id, directorName,
    	reviewContent, reviewTitle, main.userID, main.reviewID, avgScore
		FROM
			(SELECT subM.name AS movie, subM.id, directorName,
			reviewContent, reviewTitle, subR.userID, subR.reviewID
			FROM
				(SELECT DISTINCT M.id, M.name, CONCAT(D.first_name, ' ', D.last_name) AS directorName
				FROM movies M, actors A, directors D, movies_directors MD, roles MA `
				+ sqlExtra.join(' ') +
				` AND MD.movie_id = M.id
				AND MD.director_id = D.id
				AND MA.actor_id = A.id
				AND MA.movie_id = M.id) subM
				LEFT OUTER JOIN
				(SELECT M.id, reviewContent, reviewTitle, R.userID, R.reviewID
				FROM review R, movies M WHERE R.movie_id = M.id) subR
			ON subM.id = subR.id) main
		LEFT OUTER JOIN
			(SELECT R.reviewId as score_reviewID, AVG(R.reviewScore) AS avgScore
			FROM review R RIGHT OUTER JOIN movies M ON M.id = R.movie_id
			GROUP BY M.id, R.reviewID) score
		ON score_reviewID = main.reviewId`;
	
	console.log(sql);

	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			console.log("error!");
			return console.error(error.message);
		}

		let string = JSON.stringify(results);
		console.log("sending...");
		res.send({ express: string });
	});
	connection.end();
});

app.post('/api/loadAllActors', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql = `SELECT CONCAT(first_name, " ", last_name) AS actorName FROM actors`;
	console.log(sql);

	connection.query(sql, (error, results, fields) => {
		if (error) {
			console.log("error!");
			return console.error(error.message);
		}

		let string = JSON.stringify(results);
		console.log("sending...");
		res.send({ express: string });
	});
	connection.end();
});

app.post('/api/loadFollowedActors', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql = `SELECT M.name AS movie, sub1.actorName, role
		FROM movies M
		RIGHT JOIN
			(SELECT CONCAT(A.first_name, " ", A.last_name) AS actorName, role, movie_id
			FROM actors A, roles MA, actors_users AU
			WHERE A.id = MA.actor_id
			AND A.id = AU.actor_id
			AND AU.user_id = 1) sub1
		ON M.id = sub1.movie_id`;

	console.log(sql);

	connection.query(sql, (error, results, fields) => {
		if (error) {
			console.log("error!");
			return console.error(error.message);
		}

		let string = JSON.stringify(results);
		console.log("sending the following results: " + results);
		res.send({ express: string });
	});
	connection.end();
});


app.post('/api/addFollowedActors', (req, res) => {

    const { userID, actorName} = req.body;
	let data = [userID, actorName];

	let connection = mysql.createConnection(config);
	let sql = `INSERT INTO actors_users (user_id, actor_id)
		VALUES (?, 
			(SELECT id FROM actors A
			WHERE CONCAT(first_name, " ", last_name) = ?)
		)`;

	console.log(sql);

	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			console.log("error!");
			return console.error(error.message);
		}

		let string = JSON.stringify(results);
		console.log("sending...");
		res.send({ express: string });
	});
	connection.end();
});


app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version
//app.listen(port, '172.31.31.77'); //for the deployed version, specify the IP address of the server
