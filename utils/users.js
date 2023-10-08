let users = [];

//join user to chat
exports.userJoin = (id, username, room) => {
  const user = { id, username, room };

  users.push(user);

  return user;
};

exports.getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

exports.deleteUser = (id) => {
  const deletedUser = users.find((user) => user.id === id);

  users = users.filter((user) => {
    return user.id !== id;
  });

  return deletedUser;
};

exports.getRoomUsers = (room) => {
  return users.filter((user) => user.room === room);
};
