import { Chance } from 'chance';
import { connection } from 'mongoose';
import * as request from 'supertest';
import { BASE62 } from '../src/constants';
import { server } from '../src/server';
import { expectedLengthAndCharacters } from './test-helpers/expectedLengthAndCharacters';
const chance = Chance();

afterAll(() => {
    connection.dropCollection('shorts');
})

let randomShortPath: string;
const firstCustomShortPath = chance.string({ pool: BASE62 + '_-' });
const secondCustomShortPath = firstCustomShortPath + '_different';

describe('request a new short link', () => {
    it('request a random short link', () => {
        return request(server)
            .post('/new')
            .send({
                arbitraryUrl: "http://www.hittingthedatabase.com"
            })
            .expect(201)
            .then(response => {
                expectedLengthAndCharacters(response.body.shortPath);
                randomShortPath = response.body.shortPath;
            })
    });

    it('request the same arbitrary URL and get the same random short path', () => {
        return request(server)
            .post('/new')
            .send({
                arbitraryUrl: "http://www.hittingthedatabase.com"
            })
            .expect(409)
            .then(response => {
                expect(response.body.shortPath).toBe(randomShortPath);
                expect(response.body.message).toBe("That URL already has a short path in our system")
            })
    });

    it('request a custom short path, and it should work fine even on the same arbitrary URL', () => {
        return request(server)
            .post('/new')
            .send({
                arbitraryUrl: "http://www.hittingthedatabase.com",
                desiredShortPath: firstCustomShortPath
            })
            .expect(201)
            .then(response => {
                expect(response.body.shortPath).toBe(firstCustomShortPath);
            })
    });

    it('request a DIFFERENT custom short path, and it should work fine even on the same arbitrary URL', () => {
        return request(server)
            .post('/new')
            .send({
                arbitraryUrl: "http://www.hittingthedatabase.com",
                desiredShortPath: secondCustomShortPath
            })
            .expect(201)
            .then(response => {
                expect(response.body.shortPath).toBe(secondCustomShortPath);
            })
    });

    it('request a custom short path that is already taken and it should fail', () => {
        return request(server)
            .post('/new')
            .send({
                arbitraryUrl: "http://www.website.com",
                desiredShortPath: secondCustomShortPath
            })
            .expect(409)
            .then(response => {
                expect(response.body.error).toBe("That short path is already taken");
            });
    });

    it('request a custom short path with invalid characters and it should fail', () => {
        return request(server)
            .post('/new')
            .send({
                arbitraryUrl: "http://www.blahblah.com",
                desiredShortPath: "blah$"
            })
            .expect(400)
            .then(response => {
                expect(response.body.error).toBe("The short path can only contain A-Z, a-z, 0-9, _ or -");
            });
    });
})

describe('see the stats before and after the link is visited', () => {
    it('has no stats when it has never been visited', () => {
        return request(server)
            .get('/stats/' + randomShortPath)
            .expect(200)
            .then(response => {
                const { createdDate, totalNumberOfVisits, visitsEachDay} = response.body;
                const createdMsSinceEpoch = (new Date(createdDate)).getTime();
                const currentMsSinceEpoch = (new Date()).getTime();
                expect(currentMsSinceEpoch - createdMsSinceEpoch).toBeLessThan(5000);
                expect(totalNumberOfVisits).toBe(0);
                expect(visitsEachDay).toEqual({});
            })
    });

    it('redirects when visited', () => {
        return request(server)
            .get('/i/' + randomShortPath)
            .expect(302)
            .expect('location', "http://www.hittingthedatabase.com")
    });

    it('has stats about the one visit after one visit', () => {
        return request(server)
            .get('/stats/' + randomShortPath)
            .expect(200)
            .then(response => {
                const { createdDate, totalNumberOfVisits, visitsEachDay} = response.body;
                const createdMsSinceEpoch = (new Date(createdDate)).getTime();
                const currentMsSinceEpoch = (new Date()).getTime();
                expect(currentMsSinceEpoch - createdMsSinceEpoch).toBeLessThan(5000);
                expect(totalNumberOfVisits).toBe(1);
                expect(visitsEachDay).toEqual({
                    [(new Date()).toISOString().split('T')[0]]: 1
                });
            })
    });
})