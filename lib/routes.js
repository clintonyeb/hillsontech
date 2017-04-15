const Nunjucks = require('nunjucks');
const Path = require('path');
const MongoJs = require('mongojs');
const Joi = require('joi');
const NodeMailer = require('nodemailer');
const handlers = require('./handlers');
const secret = require('./secret');

exports.register = function server(server, options, next) {

    // mongodb database
    // local -> MongoJs('hillcomp', ['users']);

    server.app.db = MongoJs('clinton:hillcomp@ds141410.mlab.com:41410/hillcomp', ['users']);
    // mailer
    server.app.mailer = new Mailer();
    server.app.uuid = 1;

    // views
    server.views({
        engines: {
            html: {
                compile: function (src, options) {

                    const template = Nunjucks.compile(src, options.environment);

                    return function (context) {

                        return template.render(context);
                    };
                },

                prepare: function (options, next) {

                    options.compileOptions.environment = Nunjucks.configure(options.path, {
                        watch: false
                    });
                    return next();
                }
            }
        },
        path: Path.join(__dirname, 'views')
    });

    // Cookie validation

    const cache = server.cache({
        segment: 'sessions',
        expiresIn: 3 * 24 * 60 * 60 * 1000
    });

    server.app.cache = cache;

    let cookieValidate = function (request, session, callback) {
        cache.get(session.sid, (err, cached) => {

            if (err) {
                return callback(err, false);
            }

            if (!cached) {
                return callback(null, false);
            }
            return callback(null, true, cached.user);
        });
    };

    server.auth.strategy('session', 'cookie', true, {
        password: secret,
        cookie: 'cookie-auth',

        isSecure: false,
        clearInvalid: true,
        validateFunc: cookieValidate
    });

    // Routes    
    const routes = [{
        method: 'GET',
        path: '/',
        handler: handlers.home,
        config: {
            auth: {
                strategy: 'session',
                mode: 'try'
            }
        }
    }, {
        method: 'GET',
        path: '/index',
        handler: handlers.home,
        config: {
            auth: {
                strategy: 'session',
                mode: 'try'
            }
        }
    }, {
        method: 'GET',
        path: '/apply',
        handler: handlers.apply,
        config: {
            auth: {
                strategy: 'session',
                mode: 'try'
            }
        }
    }, {
        method: 'POST',
        path: '/apply',
        handler: handlers.registerUser,
        config: {
            validate: {
                payload: Joi.object().keys({
                    name: Joi.string().min(3).max(30).required(),
                    email: Joi.string().email().required(),
                    phone: Joi.string().required(),
                    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
                    country: Joi.string().required()
                })
            }
        },
        config: {
            auth: false
        }
    }, {
        method: 'POST',
        path: '/login',
        handler: handlers.loginUser,
        config: {
            validate: {
                payload: Joi.object().keys({
                    email: Joi.string().email().required(),
                    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
                })
            }
        },
        config: {
            auth: false
        }
    }, {
        method: 'GET',
        path: '/login',
        handler: handlers.login,
        config: {
            auth: {
                strategy: 'session',
                mode: 'try'
            }
        }
    }, {
        method: 'GET',
        path: '/logout',
        handler: handlers.logout,
        config: {
            auth: {
                strategy: 'session',
                mode: 'try'
            }
        }
    }, {
        method: 'GET',
        path: '/products',
        handler: handlers.products,
        config: {
            auth: {
                strategy: 'session',
                mode: 'try'
            }
        }
    }, {
        method: 'POST',
        path: '/contacts',
        handler: handlers.contacts,
        config: {
            auth: {
                strategy: 'session',
                mode: 'try'
            }
        }
    }, {
        method: 'GET',
        path: '/recover-pass',
        handler: handlers.recoverPassword,
        config: {
            auth: {
                strategy: 'session',
                mode: 'try'
            }
        }
    }, {
        method: 'POST',
        path: '/recover-pass',
        handler: handlers.createNewPassword,
        config: {
            auth: {
                strategy: 'session',
                mode: 'try'
            }
        }
    }, {
        method: 'GET',
        path: '/assets/{path}/{filename}',
        handler: function (request, reply) {
            reply.file(__dirname + '/views/assets/' + request.params.path + '/' + request.params.filename);
        },
        config: {
            auth: false
        }
    }];

    server.route(routes);
    next();
};

exports.register.attributes = {
    name: 'routes',
    version: '1.0.0'
};

// Utility functions

function Mailer() {

    this.transporter = NodeMailer.createTransport({
        host: 'smtp.tinglingcode.com',
        port: 587,
        secure: false,
        auth: {
            user: 'clinton@tinglingcode.com',
            pass: 'holyspirit33'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    this.sendMail = function (options, callback) {
        this.transporter.sendMail(options, callback);
    };
}