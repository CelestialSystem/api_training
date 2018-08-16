import server from './server';
import request from 'supertest';
import app from './index';

describe('users internal apis check', () => {
    it('it should pass', () => { expect('data').toBeTruthy() });
    it('it should check get all users profile', (done) => {
        request.agent(app).get('/user/')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.log("erorr: ", err);
                    return done(err);
                }
                // expect(true).toBeTruthy(res.body.data.success);
                done();
            });
    })

});
describe('user get by id api', () => {
    it('it should test get user by id api', (done) => {
        request.agent(app).get('/user/getUsers/2')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                console.log('res in test: ', res.body)
                if (err) return done(err);
                // expect(true).toBeTruthy(res.body.data.success);
                done();
            });
    })
})

describe('user get by mail api', () => {
    it('it should test get user by email api', (done) => {
        request.agent(app).get('/user/getUsers/cnek@jcke.cer')
            .query({ email: 'cnek@jcke.cer' })
            .expect(200)
            .end((err, res) => {
                console.log('res in test: ', res.body)
                if (err) return done(err);
                // expect(true).toBeTruthy(res.body.data.success);
                done();
            });
    })
})
describe('update user by mail api', () => {
    it('it should test update user by email api', (done) => {
        request.agent(app).put('/user/updateUsers/cnek@jcke.cer')
            .send({ name: 'alpha', email: 'nifty@jicker.ref', password: 'dnekfn@13$54jfr34$' })
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                console.log('res in test: ', res.body)
                if (err) return done(err);
                // expect(true).toBeTruthy(res.body.data.success);
                done();
            });
    })
})
describe('create user by mail api', () => {
    it('it should test create user api', (done) => {
        request.agent(app).post('/user/createUsers')
            .send({ id: 9, name: 'divine', email: 'divine@faith.india', password: 'always#diva18' })
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                console.log('res in test: ', res.body)
                if (err) return done(err);
                // expect(true).toBeTruthy(res.body.data.success);
                done();
            });
    })
})
describe('delete user by id api', () => {
    it('it should test get user by email api', (done) => {
        request.agent(app).delete('/user/deleteUserById/5')
            .query({ id: 5 })
            .expect(200)
            .end((err, res) => {
                console.log('res in test: ', res.body)
                if (err) return done(err);
                // expect(true).toBeTruthy(res.body.data.success);
                done();
            });
    })
})
describe('auth register user api', () => {
    it('it should test auth register user api', (done) => {
        request.agent(app).post('/auth/signup/verify')
            .send({email: 'right@right.in', userName: 'right decisive' })
            .expect(200)
            .end((err, res) => {
                console.log('res in test: ', res.body)
                if (err) return done(err);
                // expect(true).toBeTruthy(res.body.data.success);
                done();
            });
    })
})
describe('auth login user api', () => {
    it('it should test auth login user api', (done) => {
        request.agent(app).post('/auth/login')
            .send({ email: 'admin@data.in', password: 'admin' })
            .expect(200)
            .end((err, res) => {
                console.log('res in test: ', res.body)
                if (err) return done(err);
                // expect(true).toBeTruthy(res.body.data.success);
                done();
            });
    })
})