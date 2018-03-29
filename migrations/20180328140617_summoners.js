
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('summoners', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.integer('lvl').defaultTo(0);
      table.integer('icon').defaultTo(0);
      table.integer('topChamp1').defaultTo(0);
      table.integer('topChamp2').defaultTo(0);
      table.integer('topChamp3').defaultTo(0);
      table.date('created_at');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('tickets'),
  ]);
};
