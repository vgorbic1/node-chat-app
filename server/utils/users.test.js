const expect = require('expect');
const {Users} = require('./users');

describe('Users', () => {
  var users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Billy Bones',
      ticket: '123'
    }, {
      id: '2',
      name: 'John Silver',
      ticket: '123'
    }, {
      id: '3',
      name: 'Pew',
      ticket: '124'
    }];
  });

  it('should add new user', () => {
    var users = new Users();
    var user = {
      id: '4',
      name: 'Ben Gunn',
      ticket: '125'
    };
    var resUser = users.addUser(user.id, user.name, user.ticket);
    expect(users.users).toEqual([user]);
  });

  it('should remove a user', () => {
    var userId = '1';
    var user = users.removeUser(userId);
    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it('should not remove user', () => {
    var userId = '99';
    var user = users.removeUser(userId);
    expect(user).toNotExist();
    expect(users.users.length).toBe(3);
  });

  it('should find user', () => {
    var userId = '2';
    var user = users.getUser(userId);
    expect(user.id).toBe(userId);
  });

  it('should not find user', () => {
    var userId = '99';
    var user = users.getUser(userId);
    expect(user).toNotExist();
  });

  it('should return names for the ticket', () => {
    var userList = users.getUserList('123');
    expect(userList).toEqual(['Billy Bones', 'John Silver']);
  });

  it('should return names for the ticket', () => {
    var userList = users.getUserList('124');
    expect(userList).toEqual(['Pew']);
  });
});
