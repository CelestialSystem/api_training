const request = require('supertest');
const app = require('../server.js');
var generator = require('generate-password');

let token;
let user_id;

let add_user = new Object();
add_user.email = 'nick@gmail.com';
add_user.username = 'Nick';
add_user.firstName = 'nick';
add_user.lastName = 'Sharma';
add_user.password = generator.generate({
  length: 10,
  numbers: true
});

let edit_user = new Object();
edit_user.email = 'aaw@gmail.com';
edit_user.username = 'aaw';
edit_user.firstName = 'aaw';
edit_user.lastName = 'Sharma';


describe('Test /test', () => {
  test('It should response the GET method', async () => {
      await request(app).get('/').expect(200).then((res) => {

      });
  });
});


describe('Test User Registration api', () => {
  test('Registering users work as expected', async () => {
    let user = {email:'john@gmail.com', username: 'John'};
    await request(app).post('/user/register').send(user).then(function(res){
      expect(res.body.status).toBe('ok');
      expect({success:true});
      expect(typeof res.body.user.username).toBe('string');
    });
  });
});


describe('Test User login api', () => {
  test('test login response after providing correct email and password', async () => {
    let user = {email:'s.sharma@celestialsys.com', password: 'k2WN14fUPU'};
    await request(app).post('/user/login').send(user).expect(200).then(function(res){
        token = 'Bearer ' +res.body.token.jwt_token;
        expect(typeof user.email).toBe('string');
        expect(typeof user.password).toBe('string');
        expect(res.body.message).toBe('User successfully login');
    });
  });

  test('incorrect email', async () => {
    let user = {email:'nn.sharma@celestialsys.com', password: 'BEUBPGTLOK'};
    await request(app).post('/user/login').send(user).expect(401).then(function(res){
        expect(typeof user.email).toBe('string');
        expect(typeof user.password).toBe('string');
        expect(res.body.message).toBe('Incorrect email!');
    });
  });

  test('incorrect password', async () => {
    let user = {email:'s.sharma@celestialsys.com', password: 'dsfas'};
    await request(app).post('/user/login').send(user).expect(401).then(function(res){
        expect(typeof user.email).toBe('string');
        expect(typeof user.password).toBe('string');
        expect(res.body.message).toBe('Incorrect Password!');
    });
  });
});
  

describe('Test add user api', () => {
  test('testing add user api where user is unauthorized due to not passing bearer token in headers', async() =>{
    await request(app).post('/user/adduser').expect(401).then((res) => {
      expect(res.body.status).not.toBe('ok');
    });
  });

  test('should insert the user data in the database', async() => {
    await request(app).post('/user/adduser').set('Authorization', token).send(add_user).expect(200).then((res) => {
      user_id = res.body.user.id;
      expect(res.body.status).toBe('ok');
    });
  });

  test('cannot insert data due to same email id existing in the database', async() => {
    await request(app).post('/user/adduser').set('Authorization', token).send(add_user).expect(200).then((res) => {
      expect(res.body.status).not.toBe('ok');
      expect(res.body.message).toBe('Email id already exist');
    });
  });
});


describe('Test edit user api', () => {
  test('testing edit user api where user is unauthorized due to not passing bearer token in headers', async() =>{
    await request(app).post('/user/edituser/20').expect(401).then((res) => {
      expect(res.body.status).not.toBe('ok');
    });
  });

  test('edit user data', async () => {
    await request(app).post('/user/edituser/'+user_id).set('Authorization', token).send(edit_user).expect(200).then((res) => {
      expect(res.body.status).toBe('ok');
    });
  });

  test('user id not found for editing user data', async () => {
    await request(app).post('/user/edituser/40').set('Authorization', token).send(edit_user).expect(200).then((res) => {
      expect(res.body.status).not.toBe('ok');
    });
  });
});


describe('Test get user data api', () => {
  test('testing get user api where user is unauthorized due to not passing bearer token in headers', async() =>{
    await request(app).get('/user/getuser').expect(401).then((res) => {
      expect(res.body.status).not.toBe('ok');
    });
  });

  test('should return all the users from the database', async() =>{
    await request(app).get('/user/getuser').set('Authorization', token).expect(200).then((res) => {
      expect(res.body.status).toBe('ok');
    });
  });
});


describe('Test get user data by id api', () => {
  test('testing get user by id api where user is unauthorized due to not passing bearer token in headers', async() =>{
    await request(app).get('/user/getUserById/5').expect(401).then((res) => {
      expect(res.body.status).not.toBe('ok');
    });
  });

  test('should return user by id', async () =>{
    await request(app).get('/user/getUserById/5').set('Authorization', token).expect(200).then((res) => {
      expect(res.body.status).toBe('ok');
    });
  });

  test('user id not found', async () =>{
    await request(app).get('/user/getUserById/40').set('Authorization', token).expect(200).then((res) => {
      expect(res.body.message).toBe('User id not found!');
    });
  });
});


describe('Test delete user api', () => {
  test('delete user data', async () =>{
    await request(app).get('/user/deleteuser/'+user_id).set('Authorization', token).expect(200).then((res) => {
      expect(res.body.status).toBe('ok');
      expect(res.body.message).toBe('Data successfully deleted!');
    });
  });

  test('user id not found for deleting data', async () =>{
    await request(app).get('/user/deleteuser/33').set('Authorization', token).expect(200).then((res) => {
      expect(res.body.status).not.toBe('ok');
    });
  });
});