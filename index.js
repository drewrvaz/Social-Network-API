const express = require('express');
const connection = require('./config/connection');
const routes = require('./routes/index');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Connected on localhost:${PORT}!`);
  });
});
