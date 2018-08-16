
exports.up = function(knex, Promise) {
    return knex.schema.createTable('Books', (t) => {
        t.intteger('id').primary().autoIncrement;
        t.string('book_name');
        t.integer('Users_id').unique().references('Users.id');
      }).then((t) => {
          console.log("table created books");
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('Books').then((t) => {
        console.log("table dropped books");
    });
};
