const users = [
  {
    id: 1,
    email: "mail@jordanthomas.me",
    password: "test"
  }
];

module.exports = {
  find: id => users[0],
  findByLogin: (email, pasword) => {
    return users[0];
  }
};
