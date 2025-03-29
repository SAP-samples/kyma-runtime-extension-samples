#!/usr/bin/env node
'use strict'

const request = require('supertest');
const mock = require("./app.js")

describe('test app', function () {
    it('should work', function (done) {
        this.timeout(20000);
        mock.then(function (app) {

            describe('GET commerce-services console', function () {
                it('should return 200', function (done) {
                    request(app)
                        .get('/rest/v2/console')
                        .expect(200)
                        .expect('Content-Type', 'text/html; charset=utf-8', done)
                });
            });
            describe('GET commerce-services metadata', function () {
                it('should return 200', function (done) {
                    request(app)
                        .get('/rest/v2/metadata')
                        .expect(200)
                        .expect('Content-Type', 'text/x-yaml; charset=utf-8', done)
                });
            });
            describe('GET overwritten response for orders', function () {
                it('should return response 200', function (done) {
                    request(app)
                        .get("/rest/v2/electronics/orders/icke")
                        .set('Accept', 'application/json')
                        .expect(200)
                        .expect('Content-Type', 'application/json; charset=utf-8')
                        .expect(/"orderId":"icke"/, done)
                });
            });
            describe('GET InboundProduct console', function () {
                it('should return 200', function (done) {
                    request(app)
                        .get('/api/odata2webservices/InboundProduct/console/')
                        .expect(200)
                        .expect('Content-Type', 'text/html; charset=UTF-8', done)
                });
            });
            describe('GET InboundProduct metadata', function () {
                it('should return 200', function (done) {
                    request(app)
                        .get('/odata2webservices/InboundProduct/$metadata')
                        .expect(200)
                        .expect('Content-Type', 'application/xml; charset=utf-8', done)
                });
            });
            describe('GET app metadata', function () {
                it('should return 200', function (done) {
                    request(app)
                        .get('/metadata')
                        .expect(200)
                        .expect('Content-Type', 'text/yaml; charset=UTF-8', done)
                });
            });
            describe('GET app info', function () {
                it('should return 200', function (done) {
                    request(app)
                        .get('/info')
                        .set('Accept', 'application/json')
                        .expect(200)
                        .expect('Content-Type', 'application/json; charset=utf-8', done)
                });
            });
            done()
        }).catch(error => done(error));
    });
});
