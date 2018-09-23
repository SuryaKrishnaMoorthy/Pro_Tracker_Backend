exports.seed = async knex => {
  await knex('status').del();
  await knex('tasks').del();
  await knex('users').del();
};
