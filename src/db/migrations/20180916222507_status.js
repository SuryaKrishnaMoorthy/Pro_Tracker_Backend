exports.up = function (knex, Promise) {
  return knex.schema.createTable('status', table => {
    table.increments();
    table.integer('task_id').references('tasks.id').onDelete('CASCADE');
    table.date('task_date').notNullable();
    table.string('status').notNullable().default('incomplete');
    table.timestamps(true, true);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('status');
};
