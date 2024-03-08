import { expect } from 'chai';
import supertest from 'supertest';
import server from '../server.js'; // Adjusted the path

const request = supertest(server);

describe('GET /api/smart-light', () => {
    it('should GET the smart light state', (done) => {
      request.get('/api/smart-light')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('name');
          expect(res.body).to.have.property('status');
          done();
        });
    });
});