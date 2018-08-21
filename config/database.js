// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      host:'localhost',
      database: 'postgres',
      user:     'postgres',
      password: 'Cel@123'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'user_migrate'
    }
  },

  staging: {
    client: 'pg',
    connection: {
      database: 'postgres',
      user:     'postgres',
      password: 'Cel@123'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'user_migrate'
    }
  },

  production: {
    client: 'pg',
    connection: {
      database: 'postgres',
      user:     'postgres',
      password: 'Cel@123'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'user_migrate'
    }
  }

};
