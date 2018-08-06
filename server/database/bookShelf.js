
import knex from 'knex';
import bookShelf from 'bookshelf';
import dbConfig  from './db_conf';
const knexConf = knex(dbConfig.development);
const bookshelfConf = bookShelf(knexConf);
module.exports = bookshelfConf;