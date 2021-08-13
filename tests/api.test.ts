// import * as request from 'supertest';
// import { server } from '../src/server';
// import { ShortLinkModel } from '../src/short-link/model';
// import { expectedLengthAndCharacters } from './test-helpers/expectedLengthAndCharacters';

// (ShortLinkModel.find as any).exec = jest.fn();

// describe('request a new short link', () => {
//     it('request a random short link', () => {
        
//         return request(server)
//             .post('/new')
//             .send({
//                 arbitraryUrl: "http://www.hittingthedatabase.com"
//             })
//             .expect(201)
//             .then(response => {
//                 expectedLengthAndCharacters(response.body.shortPath);
//             })
//     })
// })