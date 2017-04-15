const MongoJs = require('mongojs');
const Bcrypt = require('bcrypt');
const generator = require('generate-password');
const Hoek = require('hoek');

const saltRounds = 10;

exports.home = function (request, reply) {
    return successReply(reply, 'index', request.auth.isAuthenticated ? request.auth.credentials : null);
};
exports.privacy = function (request, reply) {
    return successReply(reply, 'privacy', request.auth.isAuthenticated ? request.auth.credentials : null);
};

exports.terms = function (request, reply) {
    return successReply(reply, 'terms', request.auth.isAuthenticated ? request.auth.credentials : null);
};

exports.apply = function (request, reply) {
    if (request.auth.isAuthenticated) {
        return reply.redirect('/');
    }

    return successReply(reply, 'apply', request.auth.isAuthenticated ? request.auth.credentials : null);
};

exports.login = function (request, reply) {

    if (request.auth.isAuthenticated) {
        return reply.redirect('/');
    }
    return successReply(reply, 'login', request.auth.isAuthenticated ? request.auth.credentials : null);
};

exports.logout = function (request, reply) {
    request.cookieAuth.clear();
    return reply.redirect('/');
};

exports.registerUser = function applyUser(request, reply) {

    const user = Hoek.clone(request.payload);
    const mailer = request.server.app.mailer;
    const db = request.server.app.db;

    findDuplicate(db, user.email, err => {
        if (err) return errorReply(reply, 'apply', user, "Account with email already exists");

        Bcrypt.hash(user.password, saltRounds, function (err, hash) {
            user.password = hash;

            user.date = new Date();
            user.role = "USER";

            db.users.save(user, (err, result) => {

                if (err) return errorReply(reply, 'apply', user);

                // successReply(reply, 'apply', result, "Account registration success");
                loginUser(request, reply);

                let mail = {
                    from: '"HillsonTech Global 👻" <clinton@tinglingcode.com>',
                    to: user.email,
                    subject: 'HillsonTech Training Registration ✔',
                    text: `Hello ${user.name},\n\nWe have received your account registration.\nThanks for joining the team.\n\nWith regards,\nEng. Hillson D. Quarshie,\nHillsonTech Global Ltd.\n`
                };

                mailer.sendMail(mail, (err, info) => {
                    if (err) {
                        return;
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                });
            });
        });
    });
};

function loginUser(request, reply) {

    function checkUp(email, callback) {

        request.server.app.db.users.findOne({
            email: email
        }, (err, doc) => {
            if (err) return callback(null);

            callback(null, doc);
        });
    }

    function login() {

        let data = Hoek.clone(request.payload);

        console.log(data);
        checkUp(data.email, (err, doc) => {

            if (!err && doc) {

                let res = bcryptValidatePasswords(data.password, doc, (err, isValid) => {
                    if (err) return errorReply(reply, 'login', data);

                    if (isValid) {
                        setCookie(request, doc, err => {
                            if (err) return errorReply(reply, 'login', data);
                            console.log('redirecting');
                            return reply.redirect('/');
                        });
                    } else {
                        console.log('wrong password', data.password);
                        return errorReply(reply, 'login', data, "Username or password incorrect");
                    }
                });
            } else {
                console.log('username not found', data.email);
                return errorReply(reply, 'login', data, "Username or password incorrect");
            }
        });
    }

    return login();
}

exports.loginUser = loginUser;

exports.products = function (request, reply) {
    return successReply(reply, 'products', null);
};

exports.contacts = function (request, reply) {

    const user = Hoek.clone(request.payload);
    const mailer = request.server.app.mailer;

    let mail = {
        from: '"HillsonTech 👻" <clinton@tinglingcode.com>',
        to: 'clinton@tinglingcode.com',
        subject: 'Contact Form ✔',
        text: `From ${user.email},\n\n${user.message}.\n`
    };

    mailer.sendMail(mail, (err, info) => {
        if (err) {
            return;
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
    return reply.redirect('/');
};

exports.recoverPassword = function (request, reply) {
    return successReply(reply, 'recover-pass', null);
};

exports.createNewPassword = function (request, reply) {
    const mailer = request.server.app.mailer;
    const db = request.server.app.db;
    let data = Hoek.clone(request.payload);
    let password = generatePassword();

    Bcrypt.hash(password, saltRounds, function (err, hash) {
        db.users.update({
            email: data.email
        }, {
            $set: {
                password: hash
            }
        }, (err, doc) => {
            if (err) return errorReply(reply, 'recover-pass', data);

            successReply(reply, 'recover-pass', null, "Update success");

            let mail = {
                from: '"ADR Admin 👻" <clinton@tinglingcode.com>',
                to: data.email,
                subject: 'Password Recovery ✔',
                text: `Hello,\n\nHere is your new password\nUse this password to login to your account.\n\n\tPassword: ${password}\n\nKeep this password secret\n\nThanks,\nADR Admin.😀\n`
            };

            mailer.sendMail(mail, (err, info) => {
                if (err) {
                    return;
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
            });
        });
    });
};

// Helper functions

function successReply(reply, view, data, message) {
    return reply.view(view, {
        response: {
            error: null,
            data: {
                message: message,
                payload: data,
                page: view
            }
        }
    });
}

function errorReply(reply, view, data, message = "Internal server error") {
    return reply.view(view, {
        response: {
            error: {
                message: message
            },
            data: {
                payload: data,
                page: view
            }
        }
    });
}

function findDuplicate(db, email, callback) {

    db.users.find({
        email: email
    }, (err, docs) => {
        if (err) return callback(err);
        if (docs.length > 0) return callback(new Error('duplicate emails found'));
        return callback(null);
    });
}

function bcryptValidatePasswords(password, user, callback) {
    Bcrypt.compare(password, user.password, callback);
}

function setCookie(request, user, callback) {
    const sid = String(++request.server.app.uuid);

    request.server.app.cache.set(sid, {
        user: user
    }, 0, err => {

        if (err) {
            return callback(err);
        }

        request.cookieAuth.set({
            sid: sid
        });
        return callback(null);
    });
}

function generatePassword() {
    return generator.generate({
        length: 8,
        numbers: true,
        excludeSimilarCharacters: true
    });
}