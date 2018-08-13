const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
// Get the port env variable. If the port does not exist, set it to 3000.
const port = process.env.PORT || 3000;
var app = express();

// Register the path to store the partials.
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
// Middlewares are executed in order.
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
//   // After render the maintenance.hbs, no request will be processed.
// });

// Host the public folder
app.use(express.static(__dirname  + '/public'));

// Middleware is the function call(s) during the http requests.
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\ns', (err) => {
    if(err) {
      console.log('Unable to write to server.log');
    }
  })
  // Let the server process the request.
  next();
});

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my website',
  })
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
})

// /bad - send back json with errorMessage
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle the request'
  });
});

// Bind listener on a certain port.
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
