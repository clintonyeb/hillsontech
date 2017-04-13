const Nunjucks = require('nunjucks');
const Path = require('path');

exports.register = function server(server, options, next) {

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

    const routes = [{
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply.view('index');
        }
    }, {
        method: 'GET',
        path: '/assets/{path}/{filename}',
        handler: function (request, reply) {
            reply.file(__dirname + '/views/assets/' + request.params.path + '/' + request.params.filename);
        }
    }];

    server.route(routes);
    next();
};

exports.register.attributes = {
    name: 'routes',
    version: '1.0.0'
};