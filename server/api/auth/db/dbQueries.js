const db = require('./dbConnection');
const qry = require('./dbQryStrs');
const bcrypt = require('bcrypt-nodejs');

const generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
// check if client exists
exports.checkEmail = (clientEmail, cb) => {
  db.query({
    text: qry.checkEmail,
    values: [clientEmail],
  }, cb);
};

// get all results in DB
exports.createClient = (clientEmail, password, cb) => {
  exports.checkEmail(clientEmail, (err, response) => {
    if (err) {
      return cb(err, null);
    }
    const emailExists = response.rows[0].exists;
    if (emailExists) {
      cb(null, false);
    } else {
      const hashedPassword = generateHash(password);
      db.query({
        text: qry.createClient,
        values: [clientEmail, hashedPassword],
      }, cb);
    }
  });
};

exports.createPage = (clientEmail, cb) => {
  db.query({
    text: qry.createPage,
    values: [clientEmail],
  }, cb);
};

// check if attempted password matches DB password
exports.signIn = (clientEmail, password, cb) => {
  exports.checkEmail(clientEmail, (error, emailExists) => {
    if (error) {
      return cb(error, null);
    }
    if (!emailExists.rows[0].exists) {
      cb(null, false);
    } else {
      db.query({
        text: qry.getClient,
        values: [clientEmail],
      },
     cb);
    }
  });
};
