// Simple Hello World Application //

'use strict';

// [START app]
const express = require('express');

const app = express();

const mysql = require('mysql');

const bgColor = "lightgreen"; //"red" "lightgreen" "orange"


// this route renders the main page //
app.get('/', (req, res) => {
  //res.status(200).send('Hello, world!').end();
  res.set('Content-Type', 'text/html');
  res.status(200).send(frontPage).end();
});

app.get('/inc', (req, res) => {

	var db_result = null
	con.getConnection(function(err, connection) {
		if (err) throw err;
		console.log("Connected!");
		var sql = "UPDATE query_hits SET num_hits = num_hits + 1; SELECT num_hits FROM query_hits;";
		//var sql = "SELECT num_hits FROM query_hits";
		con.query(sql, function (err, result) {
			if (err) throw err;
			console.log("num hits updated with pooling");
			console.log(result);
			db_result = result[1][0].num_hits;
			if (db_result) {
				res.status(200).send(db_result.toString()).end();
			} else {
				res.status(400).send('Something went wrong').end();
			}
			connection.release(); // release this connection in the pool //
		});

	});
	
});

app.get('/hits', (req, res) => {

	var db_result = null
	con.getConnection(function(err, connection) {
		if (err) throw err;
		console.log("Connected!");
		var sql = "SELECT num_hits FROM query_hits;";
		con.query(sql, function (err, result) {
			if (err) throw err;
			console.log("getting number of hits");
			console.log(result);
			db_result = result[0].num_hits;
			if (db_result) {
				res.status(200).send(db_result.toString()).end();
			} else {
				res.status(400).send('Something went wrong').end();
			}
			connection.release(); // release this connection in the pool //
		});

	});
	
});

// verification text for the load tester //
app.get('/loaderio-812649678d4fb22c5cd28479ed1491a4/', (req, res) => {
  res.status(200).send('loaderio-812649678d4fb22c5cd28479ed1491a4').end();
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

// connection data //
var con = mysql.createPool({
  host: "35.192.161.6",
  user: "demo-user",
  password: "forrester",
  database: "queries",
  multipleStatements: true
});


const frontPage = `<!DOCTYPE html>
<html>
<head>
<style>
	#title-area {background-color: ${bgColor};}
	.t1 {
		font-weight: bold;
		font-size: 30px;
	}
</style>
</head>
<body>

<script>
function loadDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     document.getElementById("text-label").innerHTML = this.responseText;
    }
  };
  xhttp.open("GET", "/hits", true);
  xhttp.send();
  console.log("running loadDoc");
}


function refreshTimer() {
	setInterval(loadDoc,200); //update page every half second
}

document.addEventListener("DOMContentLoaded", function(event){
    console.log("DOM fully loaded and parsed");
    refreshTimer(); //start the time //
});

</script>

<div>
  <span class="t1" id="title-area">Cloud 10:18 Build Hit Counter Application</span>
</div>
<div id="hit-area">
  <span class="t1">Number of Hits: </span> <span class="t1" id="text-label">TBD</span>
</div>
<!--
<div>
	<button type="button" onclick="loadDoc()">Change Content</button>
</div>
-->

</body>
</html>`

// [END app]