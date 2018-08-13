const request = require('supertest');
const app = require('../server.js');
// import * as API from '../apis/users/users_controller.js';

describe('Test /test', () => {
  test('It should response the GET method', async () => {
      await request(app).get('/').expect(200).then(() => {
        // const  message = res.text;
        // expect(typeof message).toBe('string');
        // expect(message).toBe('Hello World!');
        // expect(success).toBeTruthy();
      });
  });
});

describe('Test users api', () => {
  let token;

  test('Registering users work as expected', async () => {
    let user = {email:'hi@gmail.com', username: 'Hi'};
    await request(app).post('/user/register')
    .send(user).then(function(res){
      console.log(res.body.user);
      expect(res.body.status).toBe('ok');
      expect({success:true});
      expect(typeof res.body.user.username).toBe('string');
    });
  });
  
  test('test user login api', async () => {
    let user = {email:'hello.sharma@celestialsys.com', password: 'BEUBPGTLOK'};
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
    let user = {email:'hello.sharma@celestialsys.com', password: 'dsfas'};
    await request(app).post('/user/login').send(user).expect(401).then(function(res){
        expect(typeof user.email).toBe('string');
        expect(typeof user.password).toBe('string');
        expect(res.body.message).toBe('Incorrect Password!');
    });
  });

  test('user is unauthorized due to not passing bearer token in headers', async() =>{
    await request(app).get('/user/getuser').expect(401).then((res) => {
      
    });
  });

  test('user is unauthorized due to not passing bearer token in headers', async() =>{
    await request(app).get('/user/getUserById/5').expect(401).then((res) => {
      
    });
  });

  test('should return all the users from the database', async() =>{
    await request(app).get('/user/getuser').set('Authorization', token).expect(200).then((res) => {
      expect(res.body.status).toBe('ok');
    });
  });

  test('should not return all the users due to token mismatch', async() =>{
    await request(app).get('/user/getuser').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNTM0MTYwMTYzLCJleHAiOjE1MzQxNjM3NjN9.sMEix0mvF9s0Wag2sDfYLM4tP6u_YaaDkLtIeYyW4ww').expect(200).then((res) => {
      expect(res.body.status).not.toBe('ok');
      expect(res.body.message).toBe('User is unauthorized!');
    });
  });

  test('should return user by id', async () =>{
    await request(app).get('/user/getUserById/5').set('Authorization', token).expect(200).then((res) => {
      expect(res.body.status).toBe('ok');
    });
  });

  test('should not return user by id due to token mismatch', async() =>{
    await request(app).get('/user/getUserById/5').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNTM0MTYwMTYzLCJleHAiOjE1MzQxNjM3NjN9.sMEix0mvF9s0Wag2sDfYLM4tP6u_YaaDkLtIeYyW4ww').expect(200).then((res) => {
      expect(res.body.status).not.toBe('ok');
      expect(res.body.message).toBe('User is unauthorized!');
    });
  });

  test('user id not found', async () =>{
    await request(app).get('/user/getUserById/35').set('Authorization', token).expect(200).then((res) => {
      expect(res.body.message).toBe('User id not found!');
    });
  });

 
  let user_data = new Object();
        user_data.email = 'new1@gmail.com';
        user_data.username = 'New1';
        user_data.firstName = 'New1';
        user_data.lastName = 'Test1';
        user_data.created_at = new Date();

  test('edit user data', async () =>{
    await request(app).post('/user/edituser/20').set('Authorization', token).send(user_data).expect(200).then((res) => {
      expect(res.body.status).toBe('ok');
    });
  });

  test('not editing user data due to token mismatch', async () =>{
    await request(app).post('/user/edituser/20').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNTM0MTYwMTYzLCJleHAiOjE1MzQxNjM3NjN9.sMEix0mvF9s0Wag2sDfYLM4tP6u_YaaDkLtIeYyW4ww').send(user_data).expect(200).then((res) => {
      expect(res.body.status).not.toBe('ok');
      expect(res.body.message).toBe('User is unauthorized!');
    });
  });

  test('user id not found for editing user data', async () =>{
    await request(app).post('/user/edituser/33').set('Authorization', token).send(user_data).expect(200).then((res) => {
      expect(res.body.status).not.toBe('ok');
    });
  });

  test('delete user data', async () =>{
    await request(app).get('/user/deleteuser/31').set('Authorization', token).expect(200).then((res) => {
      expect(res.body.status).toBe('ok');
      expect(res.body.message).toBe('Data successfully deleted!');
    });
  });

  test('not deleting user data due to token mismatch', async () =>{
    await request(app).get('/user/deleteuser/20').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNTM0MTYwMTYzLCJleHAiOjE1MzQxNjM3NjN9.sMEix0mvF9s0Wag2sDfYLM4tP6u_YaaDkLtIeYyW4ww').expect(200).then((res) => {
      expect(res.body.status).not.toBe('ok');
      expect(res.body.message).toBe('User is unauthorized!');
    });
  });

  test('user id not found for deleting data', async () =>{
    await request(app).get('/user/deleteuser/33').set('Authorization', token).expect(200).then((res) => {
      expect(res.body.status).not.toBe('ok');
    });
  });

});