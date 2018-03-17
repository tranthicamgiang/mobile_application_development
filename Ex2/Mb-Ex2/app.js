var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();


app.use(bodyParser.urlencoded({ extended: false }));

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

app.use('/distance', (req, res, next) => {
    let loc1 = req.query.from.split(',');
    let loc2 = req.query.to.split(',');

    if (loc1.length !== 2 || loc2.length !== 2) {
      res.sendStatus(400);
    }

    if (isNaN(loc1[0]) || isNaN(loc1[1]) || isNaN(loc2[0]) || isNaN(loc2[1])) {
        res.sendStatus(400);
    } else {
        let nLat1 = parseFloat(loc1[0]);
        let nLng1 = parseFloat(loc1[1]);
        let nLat2 = parseFloat(loc2[0]);
        let nLng2 = parseFloat(loc2[1]);

        if (!(nLat1 >= -90 && nLat1 <= 90 && nLat2 >= -90 && nLat2 <= 90) || !(nLng1 >= -180 && nLng1 <= 180 && nLng2 >= -180 && nLng2 <= 180)) {
            res.sendStatus(400);
        }

        let distance = getDistanceFromLatLonInKm(nLat1, nLng1, nLat2, nLng2);
        res.json({distance: distance })
    }
});

module.exports = app;
