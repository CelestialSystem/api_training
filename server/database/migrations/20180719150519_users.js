
exports.up = function (knex, Promise) {
    console.log("inside users migration file")
    return knex.schema.createTableIfNotExists("Users", (t) => {
      t.increments().primary();
      t.string("username").notNullable();
      t.string('email');
      t.timestamps(true, true);
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists('Users');
};
