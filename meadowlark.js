var fortune = require('./lib/fortune.js');
var express = require('express');
var app = express();

// set up handlebars view engine
var handlebars = require('express3-handlebars')
		.create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


app.set('port', process.env.PORT || 1337);

app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next){
		res.locals.showTests = app.get('env') !== 'production' &&
				req.query.test === '1';
		next();
});


app.get('/', function(req, res){
		res.render('home');
});


app.get('/about', function(req, res){
		res.render('about', {
			fortune: fortune.getFortune(),
			pageTestScript: '/qa/tests-about.js'
		});
});

app.get('/tours/hood-river', function(req, res){
		res.render('tours/hood-river');
});

app.get('/tours/request-group-rage', function(req, res){
		res.render('tours/request-group-rage');
});

// 404 catch-all handler (middleware)
app.use(function(req, res, next){
		res.status(404);
		res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
		console.error(err.stack);
		res.status(500);
		res.render('500');
});

app.listen(app.get('port'), function(){
	console.log( 'Welcome to leet world on port:' + ' ' +
		app.get('port') + '!');
});