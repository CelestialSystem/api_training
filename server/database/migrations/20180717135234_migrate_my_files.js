
exports.up = function (knex, Promise) {
    return knex.schema.createTableIfNotExists("Users1", (t) => {
      t.increments().primary();
      t.string("username").notNullable();
      t.string('email');
      t.timestamps(true, true);
    }).then(()=>{
      console.log("created table")
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists('Users1').then(() => {
      console.log("table removed");
    });
};
