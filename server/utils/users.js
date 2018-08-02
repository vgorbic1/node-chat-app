/**
 * Class to create user objects
 * Used to create a list of current users
 */
class Users {

  constructor () {
    this.users = [];
  }
  
  addUser(id, name, ticket) {
    var user = {id, name, ticket};
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    var user = this.getUser(id);
    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }
    return user;
  }

  getUser(id) {
    return this.users.filter((user) => user.id === id)[0]
  }

  getUserList(ticket) {
    var users = this.users.filter((user) => user.ticket === ticket);
    var namesArray = users.map((user) => user.name);
    return namesArray;
  }
}

module.exports = {Users};
