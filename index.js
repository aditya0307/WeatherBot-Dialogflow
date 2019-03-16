var request= require('request');
var express=require('express');
var bodyparser= require('body-parser');
var app=express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
var path=require("path");
var server=require('http').createServer(app);
var io= require('socket.io') (server);

//******* WEBHOOK******//

app.post('/webhook', function(req, res) {
	console.log('Received a post request');
	if(!req.body) return res.sendStatus(400)
	res.setHeader('Content-Type', 'application/json');
	console.log('here is the post request from Dialogflow');
	console.log(req.body);
	console.log('Got geo city parameters from the dialogflow ' + req.body.queryResult.parameters['geo-city']);
		var city= req.body.queryResult.parameters['geo-city'];
		var w= getWeather(city);
		let response= " ";// Default response from the webhook to show its working
		let responseObj={
                			"fulfillmentText": response
                			,"fulfillmentMessage":[{"text": {"text":[w]}}]
                			,"source":""
                		}
        console.log('Here is the response to the dialogflow');
        console.log(responseObj);
        return res.json(responseObj);
                //res.send(JSON.stringify);
})

//******Weather API*****//

var apiKey='0863e78ab274262be969bc8d63fdba29';
var result

function cb (err, response, body) {
	if(err){
		console.log('error:', error);
	}
	var weather= JSON.parse(body)
	if (weather.message==='city not found')
	{
		result='unable to get weather '+ weather.message;
	}
	else
	{
		result='Right now its '+weather.main.temp+ 'degree with '+weather.weather[0].description;
	}
}

function getWeather(city) {
	result=undefined;
	var url='https://api.openweathermap.org/data/2.5/weather?q={city},in&appid=0863e78ab274262be969bc8d63fdba29';
	console.log(url);
	var req = request(url, cb);
	while(result===undefined) {
		require('deasync').runLoopOnce();
	}
return result;
}
