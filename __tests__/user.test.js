const request = require('supertest');
const app = require('../server.js');
// import * as API from '../apis/users/users_controller.js';

// describe('Test /test', () => {
//   test('It should response the GET method', () => {
//       request(app).get('/').expect(200).then(() => {
//         // const  message = res.text;
//         // expect(typeof message).toBe('string');
//         // expect(message).toBe('Hello World!');
//         // expect(success).toBeTruthy();
//       }).catch(function(err){
//           console.log(err);
//       });
//   });
// });

describe('Test users api', () => {
  test('Registering users work as expected', async () => {
    let user = {email:'dsd.sharma@celestialsys.com', username: 'ddd'};
    await request(app).post('/user/register')
    .send(user).then(function(res){
      console.log(res.body.user);
      expect(res.body.status).toBe('ok');
      expect({success:true});
      expect(typeof res.body.user.username).toBe('string');
    }).catch(function(err){
      console.log(err);
    });
  });

  // test('should load users data', () =>{
  //   request(app).get('/user/getuser').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNTMzODg3NDkwfQ.EhZMME3afyYRgBesfsfCw1Ldu9cgq-EsJ1L_HCtnR30').expect(200).then((res) => {
  //     console.log(res.body.status);
  //     expect(res.body.status).toBe('ok');
  //   }).catch(function(err){
  //       console.log(err);
  //   });
  // });
});