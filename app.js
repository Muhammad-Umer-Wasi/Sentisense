const express = require('express');
const bodyParser = require('body-parser');
const brain = require('brain.js');
const data = require("./data/first.json");

const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Create and train the LSTM network
const network = new brain.recurrent.LSTM();
const traindata = data.map(items=>({
  input:items.input,
  output:items.output
}));

network.train(traindata, { iterations: 2000 });

// Set the view engine to EJS
app.set("view engine", "ejs");

// Render the initial index page
app.get("/", (req, res) => {
  res.render('index');
});

// Handle the form submission and predict sentiment
app.post("/predict", urlencodedParser, (req, res) => {
  const output = network.run(req.body.message);
  res.render('result', { mydata: req.body.message, resultdata: output });
});

// Start the server
const PORT = 3000; // Choose the desired port number
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
