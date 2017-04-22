const MongoJs = require('mongojs');
const Bcrypt = require('bcrypt');
const generator = require('generate-password');
const Hoek = require('hoek');
const Boom = require('boom');
const Fs = require('fs');
const Request = require('request');

const saltRounds = 10;


// exports
exports.home = function (request, reply) {
    return successReply(reply, 'index', request.auth.isAuthenticated ? request.auth.credentials : null);
};
exports.privacy = function (request, reply) {
    return successReply(reply, 'privacy', request.auth.isAuthenticated ? request.auth.credentials : null);
};

exports.terms = function (request, reply) {
    return successReply(reply, 'terms', request.auth.isAuthenticated ? request.auth.credentials : null);
};

exports.hire = function (request, reply) {
    return successReply(reply, 'hire', request.auth.isAuthenticated ? request.auth.credentials : null);
};


exports.changePass = function (request, reply) {
    return successReply(reply, 'change-pass', request.auth.isAuthenticated ? request.auth.credentials : null);
};

exports.cart = function (request, reply) {
    return successReply(reply, 'cart', request.auth.isAuthenticated ? request.auth.credentials : null);
};

exports.products = function (request, reply) {
    return successReply(reply, 'products', request.auth.isAuthenticated ? request.auth.credentials : null);
};

exports.apply = function (request, reply) {
    if (request.auth.isAuthenticated) {
        return reply.redirect('profile');
    }
    return successReply(reply, 'apply', request.auth.isAuthenticated ? request.auth.credentials : null);
};

exports.admin = function (request, reply) {
    return successReply(reply, 'admin-login', request.auth.isAuthenticated ? request.auth.credentials : null);
};


exports.login = function (request, reply) {

    if (request.auth.isAuthenticated) {
        console.log('loged in already');
        return reply.redirect('/');
    }
    return successReply(reply, 'login', request.auth.isAuthenticated ? request.auth.credentials : null);
};

exports.adminLogin = function (request, reply) {

    if (request.auth.isAuthenticated) {
        return reply.redirect('/admin');
    }
    return successReply(reply, 'admin-login', request.auth.isAuthenticated ? request.auth.credentials : null);
};

exports.logout = function (request, reply) {
    request.cookieAuth.clear();
    return reply.redirect('/');
};

exports.registerUser = function applyUser(request, reply) {
    const data = request.payload;
    const user = cloneWithProperties(data, ['name', 'email', 'phone', 'password', 'country']);
    console.log(user);
    const mailer = request.server.app.mailer;
    const db = request.server.app.db;

    Request.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe&response=${data['g-recaptcha-response']}`, {},
        function (error, response, body) {
            if (!error && response.statusCode == 200) {

                if (JSON.parse(body).success == true) {
                    findDuplicate(db, user.email, err => {
                        if (err) return errorReply(reply, 'apply', user, "Account with email already exists");

                        Bcrypt.hash(user.password, saltRounds, function (err, hash) {
                            user.password = hash;

                            user.date = new Date();
                            user.role = "USER";
                            user.profile = null;

                            db.users.save(user, (err, result) => {

                                if (err) return errorReply(reply, 'apply', user);

                                // successReply(reply, 'apply', result, "Account registration success");
                                // loginUser(request, reply);


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

                                return successReply(reply, 'login', null, "Registration successful");

                            });
                        });
                    });
                } else {
                    return errorReply(reply, 'apply', user, "Authentication failed");
                }
            } else {
                return errorReply(reply, 'apply', user, "Authentication failed");
            }
        }
    );
};

exports.loginUser = loginUser;

exports.loginAdmin = loginAdmin;

exports.contacts = function (request, reply) {

    let user = Hoek.clone(request.payload);
    const mailer = request.server.app.mailer;
    const db = request.server.app.db;

    user.status = 0;
    user.date = new Date();

    db.enquiries.save(user, (err, result) => {
        if (err) return errorReply(reply, 'index', user);

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
    })

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

exports.hireUs = function (request, reply) {

    const user = Hoek.clone(request.payload);
    const mailer = request.server.app.mailer;

    let mail = {
        from: '"HillsonTech 👻" <clinton@tinglingcode.com>',
        to: 'clinton@tinglingcode.com',
        subject: 'Hiring Form ✔',
        text: `From ${user.name},\n\nI wish to hire you for work. Here are the details:\n\n
            \tName: ${user.name}\n
            \tEmail Address: ${user.email}.\n
            \tPhone number: ${user.phone}\n
            \tCountry: ${user.country}\n
            \tAdditional Message: ${user.message}\n\n With regards.`
    };

    mailer.sendMail(mail, (err, info) => {
        if (err) {
            return;
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
    return reply.redirect('/');
};


exports.getApplics = getApplications;

exports.getEnquiries = getEnquiries;

exports.createAdmin = function (db) {

    let admin = {
        email: 'hillson@admin.com',
        date: new Date(),
        password: "admin",
        _id: MongoJs.ObjectId(1),
        role: "ADMIN"
    }

    findDuplicate(db, admin.email, (err) => {
        if (err) return;
        console.log('admin does not exist');

        Bcrypt.hash(admin.password, saltRounds, function (err, hash) {
            admin.password = hash;
            db.users.save(admin, (err, res) => {
                if (err) throw err;
                console.log('admin account created');
            })
        })

    })
}

exports.respondContact = function (request, reply) {
    let user = Hoek.clone(request.payload);
    const mailer = request.server.app.mailer;
    const db = request.server.app.db;

    db.enquiries.update({
        _id: MongoJs.ObjectId(user.id)
    }, {
        $set: {
            response: user.response
        }
    }, (err, res) => {
        if (err) return errorReply(reply, 'enquiries', user);

        let mail = {
            from: '"HillsonTech 👻" <clinton@tinglingcode.com>',
            to: `${user.email}`,
            subject: 'HillsonTech Company Response ✔',
            text: `${user.response}`
        };

        mailer.sendMail(mail, (err, info) => {
            if (err) {
                return;
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });

        return reply.redirect('/admin');
    })
}

exports.deleteContact = function (request, reply) {
    let user = Hoek.clone(request.payload);
    const db = request.server.app.db;

    db.enquiries.remove({
        _id: MongoJs.ObjectId(user.id)
    }, (err, res) => {
        if (err) return errorReply(reply, 'enquiries', user);

        return reply.redirect('/admin');
    })
}

exports.addProfile = function (request, reply) {
    let user = cloneWithProperties(request.payload, ['email', 'program', 'timing', 'gender',
        'profession', 'prof-other', 'address', 'sponsor', 'sponsor-name', 'sponsor-rel',
        'sponsor-occ', 'sponsor-contact'
    ]);

    const db = request.server.app.db;

    getDocument(request, (err, file) => {
        if (err) return errorReply(reply, 'apply2', user, err.message);

        user.document = file;

        db.users.update({
            email: user.email
        }, {
            $set: {
                profile: user,
            }
        }, (err, res) => {
            if (err) return errorReply(reply, 'apply2', user, err.message);

            return reply.redirect('/');
        })

    })

}

exports.getProfile = function (request, reply) {

    if (!request.auth.isAuthenticated) {
        return reply.redirect('/login');
    }

    let user = request.auth.credentials;
    const db = request.server.app.db;

    db.users.findOne({
        email: user.email
    }, (err, doc) => {
        if (err) return errorReply(reply, 'profile', user, err.message);
        return successReply(reply, 'profile', doc);
    })

}

exports.getUserDetails = getUserData;

function getDocument(request, cb) {

    const payload = request.payload;

    if (payload.file) {

        let name = payload.email + payload.file.hapi.filename;
        let path = __dirname + '/uploads/' +  name; 
        let file = Fs.createWriteStream(path);

        file.on('error', (err) => {
            console.log(err);
            return cb(new Error('Error saving file, please try again'));
        })

        payload.file.pipe(file);

        payload.file.on('end', (err) => {
            if (err) return cb(new Error('Error saving file, please try again'));

            return cb(null, name);
        })
    } else {
        return cb(new Error('File not uploaded'));
    }
}

// Internals..

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
    console.log(data, message);
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
    return Bcrypt.compare(password, user.password, callback);
}

function setCookie(request, user, callback) {
    const sid = String(++request.server.app.uuid);

    if (request.payload.keep == 'on') {}

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

function checkAdmin(request) {
    let adminEmail = "hillson@admin.com";
    let adminPass = "admin";

    if (!request.auth.isAuthenticated) {
        return false;
    }

    if (request.auth.credentials.email !== adminEmail &&
        request.auth.credentials.password !== adminPass) {

        return false;
    }

    return true;
}

function getEnquiries(request, reply) {

    if (!checkAdmin(request)) {
        return errorReply(reply, 'login', null);
    }

    const db = request.server.app.db;
    const data = request.params
    const page = data.page || 0

    db.enquiries
        .find({})
        .limit(10)
        .skip(page * 10)
        .sort({
            date: -1
        })
        .toArray((err, docs) => {
            if (err) return reply(Boom.wrap(err, 'Internal server error'));

            console.log('enquiries', docs.length);

            return reply.view('enquiries', {
                response: {
                    error: null,
                    data: {
                        payload: docs,
                        page: 'enquiries',
                        limit: docs.length,
                        message: ""
                    }
                }

            })
        })

}

function getApplications(request, reply) {

    if (!checkAdmin(request)) {
        return errorReply(reply, 'login', null);
    }

    const db = request.server.app.db;
    let data = request.params;
    const page = data.page || 0

    db.users
        .find({
            role: "USER"
        }, {
            name: 1,
            email: 1,
            date: 1,
            _id: 1,
            country: 1
        })
        .limit(10)
        .skip(page * 10)
        .sort({
            date: -1
        })
        .toArray((err, docs) => {
            if (err) return reply(Boom.wrap(err, 'Internal server error'));
            console.log('here', docs.length);

            return reply.view('applics', {
                response: {
                    error: null,
                    data: {
                        payload: docs,
                        page: 'applics',
                        limit: docs.length,
                        message: ""
                    }
                }

            })
        })
}

function getUserData(request, reply) {

    if (!checkAdmin(request)) {
        return errorReply(reply, 'login', null);
    }

    const db = request.server.app.db;
    let data = request.params;
    const page = data.page || 0


    db.users
        .findOne({
            _id: MongoJs.ObjectId(data.id)
        }, (err, doc) => {
            if (err) return reply(Boom.wrap(err, 'Internal server error'));

            return reply.view('user-details', {
                response: {
                    error: null,
                    data: {
                        payload: doc,
                        page: 'user-details',
                        message: ""
                    }
                }

            })
        })

}

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

        checkUp(data.email, (err, doc) => {

            if (!err && doc) {

                let res = bcryptValidatePasswords(data.password, doc, (err, isValid) => {
                    if (err) return errorReply(reply, 'login', data);

                    if (isValid) {
                        setCookie(request, doc, err => {
                            if (err) return errorReply(reply, 'login', data);

                            if (doc.profile == null) {
                                return successReply(reply, 'apply2', doc);
                            }

                            return successReply(reply, 'index', doc);
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

function loginAdmin(request, reply) {

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

        checkUp(data.email, (err, doc) => {

            if (!err && doc) {

                let res = bcryptValidatePasswords(data.password, doc, (err, isValid) => {
                    if (err) return errorReply(reply, 'admin-login', data);

                    if (isValid) {
                        setCookie(request, doc, err => {
                            if (err) return errorReply(reply, 'admin-login', data);

                            return reply.redirect('/admin');
                        });
                    } else {
                        console.log('wrong password', data.password);
                        return errorReply(reply, 'admin-login', data, "Username or password incorrect");
                    }
                });
            } else {
                console.log('username not found', data.email);
                return errorReply(reply, 'admin-login', data, "Username or password incorrect");
            }
        });
    }

    return login();
}

function cloneWithProperties(obj, props) {
    let retObj = {};
    props.forEach(function (element) {
        retObj[element] = obj[element];
    }, this);

    return retObj;
}