var knexobj = require('../../knexfile');
var knex = require('knex')(knexobj.development);
var bookshelf = require('bookshelf')(knex);

var User = bookshelf.Model.extend({
    tableName: 'users'
});

module.exports = User;