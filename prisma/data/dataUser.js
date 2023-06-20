const { getLocalISOString } = require("../../src/utils/timestamp-utils");

const date = getLocalISOString();
const dataUser = [
  {
    id_user: 1,
    username: "iterahero2022",
    email: "iterahero2022@gmail.com",
    name: "iterahero",
    password: "iterahero",
    created_at: date,
    updated_at: date,
  },
];

module.exports = dataUser;
