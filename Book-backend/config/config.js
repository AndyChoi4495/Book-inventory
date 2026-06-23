// sequelize-cli용 설정: 앱과 동일하게 DATABASE_URL + Supabase SSL 사용
require('dotenv').config();

const common = {
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};

module.exports = {
  development: common,
  test: common,
  production: common,
};
