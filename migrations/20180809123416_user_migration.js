exports.up = (knex, Promise) => {
    return knex.schema.createTable('users', (table) => {
      table.increments('id').primary().notNullable();
      table.string('email').unique().notNullable();
      table.string('username').unique().notNullable();
      table.string('password').unique();
      table.string('googleId').unique();
      table.string('access_token').unique();
      table.string('firstName');
      table.string('lastName');
      table.string('jwt_token').unique();
      table.timestamp('loginTime');
      table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    });
  };
  
  exports.down = (knex, Promise) => {
    return knex.schema.dropTable('users');
  };