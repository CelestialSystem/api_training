
exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists('google_users_new', (t) => {
        t.integer('id').primary().autoIncrement;
        t.string('name');
        t.string('google_id');
        t.string('google_mail');
        t.string('google_token');
        t.string('created_at');
      }).then((t) => {
          console.log("table created books");
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('google_users').then((t) => {
        console.log("table dropped books");
    });
};
