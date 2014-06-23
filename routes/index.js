
/*
 * GET home page.
 */
var async = require('async');
var passport = require('passport');

var Db = require(global.appdir + '/db');
var db = Db.db;
var config  = require(global.appdir + '/config.js');
var setup = require(global.appdir + '/setup.js');

module.exports = exports = routes = {};

function badGlobalError(req, res, next) {
    if (!global.BAD_ERROR) { return next();}
    var title = global.CONFIG.name ? global.CONFIG.name : "Rybot Trade Bot";
    var params = {
        title: title, 
        config: global.CONFIG, 
        name: title,
        error_message: req.flash('error'),
        error: global.BAD_ERROR
    };
    res.render('error', params);
}

function ensureSetup(req, res, next) {
    if (!global.SETUP) { return next(); }
    res.redirect('/setup')
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

exports.add_routes = function(app) {
    app.use(badGlobalError);

    app.get('/', ensureSetup, ensureAuthenticated, routes.index);

    app.get('/setup', routes.setup);
    app.post('/setup', routes.setup);

    app.get('/login', ensureSetup, routes.login);
    app.post('/login', ensureSetup, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
        function(req, res) {
            res.redirect('/');
        }
    )

    app.get('/logout', ensureSetup, function(req, res){
        req.logout();
        res.redirect('/');
    });

    app.get('/candle/:name/:mins/:pair/:date_start/:date_end', ensureSetup, ensureAuthenticated,  routes.candles);

    app.get ('/settings', ensureSetup, ensureAuthenticated, routes.settings.render)
}

routes.login = function(req, res){
    var title = global.CONFIG.name ? global.CONFIG.name : "Rybot Trade Bot"
    res.render('login', { title: title, name: title, error_message: req.flash('error') })   
}

routes.setup = require('./setup.js');
routes.settings = require('./settings.js');

routes.index = function(req, res){
    var title = global.CONFIG.name ? global.CONFIG.name : "Rybot Trade Bot"
    res.render('index', {title: title, name:  title })
};

routes.candles = require('./candles.js')