var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var validator = require('validator');
var safeGet = require('lodash.get');
var users = require('../data/users.json');

/* User API endpoints */
router.get('/', function(req, res, next) {
    res.render('api', {
        title: 'User API endpoints',
        endpoints: [
            {
                name: '/create',
                params: ['first', 'last', 'username', 'password'],
                instructions: [
                    'Usernames can\'t contain an ampersand (&), equal sign (=), brackets (<,>), plus sign (+), comma (,), or periods (.).',
                    'Usernames can contain letters (a-z), numbers (0-9), dashes (-), and underscores (_).',
                    'Usernames can begin or end with non-alphanumeric characters, with a maximum of 64 characters.',
                    'Passwords must contain a minimum of 8 and Maximum of 63 characters with at least 1 Uppercase Alphabet, 1 Lowercase Alphabet, 1 Number and 1 Special Character.'
                ],
                example: '/api/create?first=Aaron&last=Ford&username=aaronford&password=Abc123@!321cbA'
            },
            {
                name: '/login',
                params: ['username', 'password'],
                instructions: [
                    'If username doesn\'t exist, error is returned.',
                    'If username exists but password is incorrect, error is returned.',
                    'If username and password exist, token is returned.'
                ],
                example: '/api/login?username=aaronford&password=Abc123@!321cbA'
            },
            {
                name: '/fetch',
                params: ['username'],
                instructions: [
                    'If username doesn\'t exist, error is returned.',
                    'If username exists, user data is returned.'
                ],
                example: '/api/fetch?username=aaronford'
            },
            {
                name: '/update',
                params: ['first', 'last', 'username', 'password'],
                instructions: [
                    'Valid username is required. If username doen\'t exist, error is returned',
                    'Any other parameters passed will replace existing parameters.',
                    'Does not add new parameters, only updates existing ones.'
                ],
                example: '/api/update?username=aaronford&first=Ron&last=Chevy&password=newPassword123!'
            },
            {
                name: '/delete',
                params: ['username'],
                instructions: [
                    'Valid username is required. If username doen\'t exist, error is returned',
                    'If user exists, user is deleted'
                ],
                example: '/api/delete?username=aaronford'
            }
        ]

    });
});

router.get('/create', function(req, res, next) {

    var first = String(safeGet(req, 'query.first', ''));
    var last = String(safeGet(req, 'query.last', ''));
    var username = String(safeGet(req, 'query.username', ''));
    var password = String(safeGet(req, 'query.password', ''));

    if (!username.match(/^[0-9a-zA-Z_-]+$/) || username.length > 64 || username == '')
        res.json({error: "Invalid username"});

    else if (users[username])
        res.json({error: "Username already exists"});

    else if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,63}/))
        res.json({error: "Invalid password"});

    //else if (!validator.isEmail(safeGet(req, 'query.email')))
    //    res.json({'error': "Username already exists"});

    else if (!validator.isAlpha(first))
        res.json({error: "Invalid first name"});

    else if (!validator.isAlpha(last))
        res.json({error: "Invalid last name"});

    else {
        var date = new Date();
        var components = [
            date.getYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        ];

        var id = components.join("");

        users[safeGet(req, 'query.username')] = {
            first: safeGet(req, 'query.first'),
            last: safeGet(req, 'query.last'),
            password: password,
            id: id
            // Can add other parameters like email
            //'email': safeGet(req, 'query.email')
        };

        fs.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(users), function (err) {
            console.log(err);
        });

        res.json({userId: id});
    }

});

router.get('/login', function(req, res, next) {

    var username = String(safeGet(req, 'query.username', ''));
    var password = String(safeGet(req, 'query.password', ''));

    if (users[username]) {
        if(safeGet(users[username], 'password') == password)
            res.json({
                login: true,
                token: safeGet(users[username], 'id')
            });
        else
            res.json({
                login: false,
                error: "Invalid password"
            });
    }
    else {
        res.json({
            error: "User " + username + " does not exist"
        });
    }

});

router.get('/fetch', function(req, res, next) {

    // I would think this should require some sort of authorization as it would return password and user id,
    // not sure if I need to worry about that for this test. Or I could not return the password. Either way.
    var username = String(safeGet(req, 'query.username', ''));

    if (users[username]) {
        res.json(users[username]);
    }
    else {
        res.json({
            error: "User " + username + " does not exist"
        });
    }

});

router.get('/update', function(req, res, next) {

    var username = String(safeGet(req, 'query.username', ''));

    if (!users[username])
        res.json({
            update: false,
            error: "User " + username + " does not exist"
        });
    else {
        // This allows updates to existing parameters. If additional parameters are to be added, this won't do it
        for (var param in req.query) {
            if (users[username].hasOwnProperty(param))
                users[username][param] = req.query[param];
        }

        fs.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(users), function (err) {
            console.log(err);
        });

        res.json({
            update: true,
            message: username + " was updated"
        });
    }

});

router.get('/delete', function(req, res, next) {

    var username = String(safeGet(req, 'query.username', ''));
    var password = String(safeGet(req, 'query.password', ''));

    if (users[username]) {
        delete users[username];

        fs.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(users), function (err) {
            console.log(err);
        });

        res.json({
            delete: true,
            message: username + " was deleted"
        });
    }
    else {
        res.json({
            delete: false,
            error: "User " + username + " does not exist"
        });
    }

});

module.exports = router;
