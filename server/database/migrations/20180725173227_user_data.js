
exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists('user_data', (t) => {
        t.integer('id').autoIncrement;
        t.string('user_name');
        t.string('email');
        t.string('password');
      }).then((t) => {
          console.log("table created books");
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('user_data').then((t) => {
        console.log("table dropped books");
    });
};
