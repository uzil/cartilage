'use strict';

const expect = require('chai').expect;
const supertest = require('supertest');
const app = require('./server/express');

const request = supertest.agent(app);

describe('Cartilage Middleware', () => {
  it('should send error response invalid header', (done) => {
    request
      .post('/cartilage-test/1')
      .send({
        name: 'testName',
        username: 'testUser',
        role: 'admin'
      })
      .expect(400)
      .end((error, res) => {
        if (error) return done(error);

        expect(res.body).to.have.property('name');
        expect(res.body).to.have.property('details');
        expect(res.body.name).to.be.equal('ValidationError');

        done();
      });
  });

  it('should send error response invalid body', (done) => {
    request
      .post('/cartilage-test/1')
      .set({ 'x-access-code': 'someUniqueAuthCode'})
      .send({
        name: 'testName',
        role: 'admin'
      })
      .expect(400)
      .end((error, res) => {
        if (error) return done(error);

        expect(res.body).to.have.property('name');
        expect(res.body).to.have.property('details');
        expect(res.body.name).to.be.equal('ValidationError');

        done();
      });
  });

  it('should send error response invalid param', (done) => {
    request
      .post('/cartilage-test/ss')
      .set({ 'x-access-code': 'someUniqueAuthCode'})
      .send({
        name: 'testName',
        username: 'testUser',
        role: 'admin'
      })
      .expect(400)
      .end((error, res) => {
        if (error) return done(error);

        expect(res.body).to.have.property('name');
        expect(res.body).to.have.property('details');
        expect(res.body.name).to.be.equal('ValidationError');

        done();
      });
  });

  it('should send error response if some unknown key in body', (done) => {
    request
      .post('/cartilage-test/1')
      .set({ 'x-access-code': 'someUniqueAuthCode'})
      .send({
        name: 'testName',
        username: 'testUser',
        role: 'admin',
        email: 'addrr@email.com'
      })
      .expect(400)
      .end((error, res) => {
        if (error) return done(error);

        expect(res.body).to.have.property('name');
        expect(res.body).to.have.property('details');
        expect(res.body.name).to.be.equal('ValidationError');

        done();
      });
  });

  it('should send validated response', (done) => {
    const body = {
      name: 'testName',
      username: 'testUser',
      role: 'admin'
    };

    const headers = {
      'x-access-code': 'someUniqueAuthCode',
      'x-tag': 'batman'
    };

    request
      .post('/cartilage-test/1?q=superman')
      .set(headers)
      .send(body)
      .expect(200)
      .end((error, res) => {
        if (error) return done(error);

        expect(res.body).to.have.property('headers');
        expect(res.body).to.have.property('body');
        expect(res.body).to.have.property('params');
        expect(res.body).to.have.property('query');
        expect(res.body.body.name).to.be.equal(body.name);
        expect(res.body.body.username).to.be.equal(body.username);
        expect(res.body.body.role).to.be.equal(body.role);
        expect(res.body.params.id).to.be.equal(1);
        expect(res.body.query.q).to.be.equal('superman');
        expect(res.body.headers['x-access-code']).to.be.equal(headers['x-access-code']);
        expect(res.body.headers['x-tag']).to.be.equal(headers['x-tag']);

        done();
      });
  });

  it('should send validated response with joi transforms', (done) => {
    const body = {
      name: 'testName',
      username: 'testUser',
    };

    const headers = {
      'x-access-code': 'someUniqueAuthCode',
    };

    request
      .post('/cartilage-test/1?q=superman')
      .set(headers)
      .send(body)
      .expect(200)
      .end((error, res) => {
        if (error) return done(error);

        expect(res.body).to.have.property('headers');
        expect(res.body).to.have.property('body');
        expect(res.body).to.have.property('params');
        expect(res.body).to.have.property('query');
        expect(res.body.body.name).to.be.equal(body.name);
        expect(res.body.body.username).to.be.equal(body.username);
        expect(res.body.body.role).to.be.equal('normal');
        expect(res.body.params.id).to.be.equal(1);
        expect(res.body.query.q).to.be.equal('superman');
        expect(res.body.headers['x-access-code']).to.be.equal(headers['x-access-code']);
        expect(res.body.headers['x-tag']).to.be.equal('no_tag');

        done();
      });
  });
})