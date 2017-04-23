const Nunjucks = require("nunjucks");
const Path = require("path");
const MongoJs = require("mongojs");
const Joi = require("joi");
const NodeMailer = require("nodemailer");
const handlers = require("./handlers");

exports.register = function server(server, options, next) {
  const env = process.env.NODE_ENV || "dev";

  if (env === "dev") {
    server.app.db = MongoJs("hillcomp", ["users", "applics", "enquiries"]);
    server.app.env = require("./dev.env.json");
  } else {
    server.app.db = MongoJs(
      "clinton:hillcomp@ds141410.mlab.com:41410/hillcomp",
      ["users"]
    );
    server.app.env = require("./prod.env.json");
  }

  // mailer
  server.app.mailer = new Mailer();
  server.app.uuid = 1;

  // views
  server.views({
    engines: {
      html: {
        compile: function(src, options) {
          const template = Nunjucks.compile(src, options.environment);

          return function(context) {
            return template.render(context);
          };
        },

        prepare: function(options, next) {
          options.compileOptions.environment = Nunjucks.configure(
            options.path,
            {
              watch: false
            }
          );
          return next();
        }
      }
    },
    path: Path.join(__dirname, "views/templates")
  });

  // Cookie validation

  const cache = server.cache({
    segment: "sessions",
    expiresIn: 3 * 24 * 60 * 60 * 1000
  });

  server.app.cache = cache;

  let cookieValidate = function(request, session, callback) {
    cache.get(session.sid, (err, cached) => {
      if (err) {
        return callback(err, false);
      }

      if (!cached) {
        return callback(null, false);
      }

      return callback(null, true, cached.user, {
        username: cached.user.email,
        role: cached.user.role
      });
    });
  };

  server.auth.strategy("session", "cookie", true, {
    password: server.app.env.secret,
    cookie: "cookie-auth",
    redirectTo: "/admin-login",
    isSecure: false,
    clearInvalid: true,
    validateFunc: cookieValidate,
    redirectOnTry: false
  });

  // Admin Account
  handlers.createAdmin(server.app.db);

  // Routes
  const routes = [
    {
      method: "GET",
      path: "/",
      handler: handlers.home,
      config: {
        auth: {
          strategy: "session",
          mode: "try"
        }
      }
    },
    {
      method: "GET",
      path: "/index",
      handler: handlers.home,
      config: {
        auth: {
          strategy: "session",
          mode: "try"
        }
      }
    },
    {
      method: "GET",
      path: "/apply",
      handler: handlers.apply,
      config: {
        auth: {
          strategy: "session",
          mode: "try"
        }
      }
    },
    {
      method: "POST",
      path: "/apply",
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
    },
    {
      method: "POST",
      path: "/login",
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
    },
    {
      method: "POST",
      path: "/admin-login",
      handler: handlers.loginAdmin,
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
    },
    {
      method: "GET",
      path: "/login",
      handler: handlers.login,
      config: {
        auth: {
          strategy: "session",
          mode: "try"
        }
      }
    },
    {
      method: "GET",
      path: "/admin-login",
      handler: handlers.adminLogin,
      config: {
        auth: {
          strategy: "session",
          mode: "try"
        }
      }
    },
    {
      method: "GET",
      path: "/logout",
      handler: handlers.logout,
      config: {
        auth: {
          strategy: "session",
          mode: "try"
        }
      }
    },
    {
      method: "GET",
      path: "/products",
      handler: handlers.products,
      config: {
        auth: {
          strategy: "session",
          mode: "try"
        }
      }
    },
    {
      method: "GET",
      path: "/privacy",
      handler: handlers.privacy,
      config: {
        auth: {
          strategy: "session",
          mode: "try"
        }
      }
    },
    {
      method: "GET",
      path: "/terms",
      handler: handlers.terms,
      config: {
        auth: {
          strategy: "session",
          mode: "try"
        }
      }
    },
    {
      method: "GET",
      path: "/hire",
      handler: handlers.hire,
      config: {
        auth: {
          strategy: "session",
          mode: "try"
        }
      }
    },
    {
      method: "GET",
      path: "/change-pass",
      handler: handlers.changePass,
      config: {
        auth: {
          strategy: "session",
          mode: "try"
        }
      }
    },
    {
      method: "GET",
      path: "/payment",
      handler: handlers.payment,
      config: {
        auth: {
          strategy: "session",
          mode: "try"
        }
      }
    },
    {
      method: "GET",
      path: "/payment-pdf",
      handler: handlers.getPDF,
      config: {
        auth: {
          strategy: "session",
          mode: "try"
        }
      }
    },
    {
      method: "GET",
      path: "/cart",
      handler: handlers.cart,
      config: {
        auth: {
          strategy: "session",
          mode: "try"
        }
      }
    },
    {
      method: "GET",
      path: "/admin",
      handler: handlers.getEnquiries,
      config: {
        auth: {
          strategy: "session",
          mode: "required"
        },
        plugins: {
          hapiAuthorization: {
            roles: ["ADMIN"]
          }
        }
      }
    },
    {
      method: "GET",
      path: "/admin/enquiries",
      handler: handlers.getEnquiries,
      config: {
        auth: {
          strategy: "session",
          mode: "required"
        },
        plugins: {
          hapiAuthorization: {
            roles: ["ADMIN"]
          }
        }
      }
    },
    {
      method: "GET",
      path: "/admin/applics",
      handler: handlers.getApplics,
      config: {
        auth: {
          strategy: "session",
          mode: "required"
        },
        plugins: {
          hapiAuthorization: {
            roles: ["ADMIN"]
          }
        }
      }
    },
    {
      method: "GET",
      path: "/admin/applics/{id}",
      handler: handlers.getUserDetails,
      config: {
        auth: {
          strategy: "session",
          mode: "required"
        },
        plugins: {
          hapiAuthorization: {
            roles: ["ADMIN"]
          }
        }
      }
    },
    {
      method: "POST",
      path: "/contacts",
      handler: handlers.contacts,
      config: {
        auth: {
          strategy: "session",
          mode: "try"
        }
      }
    },
    {
      method: "GET",
      path: "/recover-pass",
      handler: handlers.recoverPassword,
      config: {
        auth: {
          strategy: "session",
          mode: "try"
        }
      }
    },
    {
      method: "GET",
      path: "/pdf-file/{email}",
      handler: handlers.pdfFile,
      config: {
        auth: false
      }
    },
    {
      method: "POST",
      path: "/recover-pass",
      handler: handlers.createNewPassword,
      config: {
        auth: {
          strategy: "session",
          mode: "try"
        }
      }
    },
    {
      method: "POST",
      path: "/respond-email",
      handler: handlers.respondContact,
      config: {
        auth: {
          strategy: "session",
          mode: "try"
        },
        plugins: {
          hapiAuthorization: {
            roles: ["ADMIN"]
          }
        }
      }
    },
    {
      method: "POST",
      path: "/contact-delete",
      handler: handlers.deleteContact,
      config: {
        auth: {
          strategy: "session",
          mode: "try"
        },
        plugins: {
          hapiAuthorization: {
            roles: ["ADMIN"]
          }
        }
      }
    },
    {
      method: "POST",
      path: "/profile",
      handler: handlers.addProfile,
      config: {
        auth: {
          strategy: "session",
          mode: "try"
        },
        payload: {
          output: "stream",
          parse: true,
          allow: "multipart/form-data"
        }
      }
    },
    {
      method: "GET",
      path: "/profile",
      handler: handlers.getProfile,
      config: {
        auth: {
          strategy: "session",
          mode: "try"
        },
        plugins: {
          hapiAuthorization: {
            roles: ["ADMIN", "USER"]
          }
        }
      }
    },
    {
      method: "GET",
      path: "/assets/{path}/{filename}",
      handler: function(request, reply) {
        reply.file(
          __dirname +
            "/views/assets/" +
            request.params.path +
            "/" +
            request.params.filename
        );
      },
      config: {
        auth: false
      }
    }
  ];

  server.route(routes);

  server.ext("onPreResponse", function(request, reply) {
    var response = reply.request.response;
    if (response.isBoom) {
      if (
        response.message.match(
          "Payload content length greater than maximum allowed"
        )
      ) {
        request.response.output.payload.message =
          "Passport picture greater than 1MB";
      }
    }
    return reply.continue();
  });

  next();
};

exports.register.attributes = {
  name: "routes",
  version: "1.0.0"
};

// Utility functions

function Mailer() {
  this.transporter = NodeMailer.createTransport({
    host: "smtp.tinglingcode.com",
    port: 587,
    secure: false,
    auth: {
      user: "clinton@tinglingcode.com",
      pass: "holyspirit33"
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  this.sendMail = function(options, callback) {
    this.transporter.sendMail(options, callback);
  };
}
