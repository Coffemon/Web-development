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
function getWeatherData(){
	return {
			locations: [
			{
				name: 'Portland',
				forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
				iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
				weather: 'Overcast',
				temp: '54.1 F (12.3 C)',
			},
			{
				name: 'Bend',
				forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
				iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
				weather: 'Partly Cloudy',
				temp: '55.0 F (12.8 C)',
			},
			{
				name: 'Manzanita',
				forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
				iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
				weather: 'Light Rain',
				temp: '55.0 F (12.8 C)',
			},
		],
	};
}


app.use(function(req, res, next){
		res.locals.showTests = app.get('env') !== 'production' &&
				req.query.test === '1';
		next();
});

app.get('/headers', function(req, res){
		res.set('Content-Type', 'text/plain');
		var s = '';
		for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
		res.send(s);
});

app.disable('x-powered-by');

app.use(function(req, res, next){
		if(!res.locals.partials) res.locals.partials = {};
		res.locals.partials.weather = getWeatherData();
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

	//this should appear AFTER all your routes
	// 404 catch-all handler (middleware)
app.use(function(req, res, next){
		res.status(404);
		res.render('404');
});

	// this should appear AFTER all of your routes 
	// note that even if you don't need the "next" 
	// function, it must be included for Express 
	// to recognize this as an error handler 
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