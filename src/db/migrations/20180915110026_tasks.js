exports.up = function (knex, Promise) {
  return knex.schema.createTable('tasks', table => {
    table.increments();
    table.integer('user_id').references('users.id').onDelete('CASCADE');
    table.string('task_name').notNullable();
    table.text('description').notNullable().default('');
    table.string('task_type').notNullable();
    table.string('location');
    table.string('icon_name');
    table.string('icon_color');
    table.string('icon_type');
    table.string('status').notNullable();
    table.string('r_rule').notNullable().default('');
    table.date('start_date').notNullable().default(knex.fn.now());
    table.date('end_date').notNullable();
    table.time('start_time');
    table.time('end_time');
    table.integer('total_score').notNullable().default(0);
    table.integer('current_score').notNullable().default(0);
    table.timestamps(true, true);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('tasks');
};
