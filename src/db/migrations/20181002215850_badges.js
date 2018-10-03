exports.up = function (knex, Promise) {
  return knex.schema.createTable('badges', table => {
    table.increments();
    table.integer('user_id').references('users.id').onDelete('CASCADE');
    table.integer('score').notNullable().default(0);
    table.integer('bronze').notNullable().default(0);
    table.integer('silver').notNullable().default(0);
    table.integer('gold').notNullable().default(0);
    table.integer('platinum').notNullable().default(0);
    table.integer('opal').notNullable().default(0);
    table.integer('diamond').notNullable().default(0);
    table.integer('painite').notNullable().default(0);
    table.integer('ruby').notNullable().default(0);
    table.integer('jadeite').notNullable().default(0);
    table.integer('garnet').notNullable().default(0);
    table.timestamps(true, true);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('badges');
};
