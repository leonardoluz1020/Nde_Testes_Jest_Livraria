import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import request from 'supertest';
import app from '../../app.js';

let server;
beforeEach(() => {
  const port = 8080;
  server = app.listen(port);
});
afterEach(() => {
  server.close();
});

let respostaId;
describe('POST em /autores', () => {
  it('Deve criar um novo autor', async () => {
    const resposta = await request(app)
      .post('/autores')
      .send({
        nome: 'JRR Tolkien',
        nacionalidade: 'sul-africano',
      })
      .expect(201);
    respostaId = resposta.body.content.id;
  });
});
describe('GET em /autores', () => {
  it('Deve buscar todos autores', async () => {
    const autores = await request(app)
      .get('/autores')
      .set('Accept', 'application/json')
      .expect('content-type', /json/)
      .expect(200);
    expect(autores.body[0].nacionalidade).toEqual('sul-africano');
  });
  it('Dever acessar autor por id', async () => {
    const resposta = await request(app)
      .get(`/autores/${respostaId}`)
      .set('Accept', 'application/json')
      .expect('content-type', /json/)
      .expect(200);
    expect(resposta.body.id).toBe(respostaId);
  });
});
describe('PUT em /autores/id', () => {
  it.each([
    ['nome', { nome: 'JRR Tolkien' }],
    ['nacionalidade', { nacionalidade: 'Sul-africano' }],
  ])('Deve alterar o campo %s', async (chave, params) => {
    const requisicao = { request };
    const spy = jest.spyOn(requisicao, 'request');
    await requisicao.request(app)
      .put(`/autores/${respostaId}`)
      .send(params)
      .expect(204);
    expect(spy).toHaveBeenCalled();
  });
});
describe('DELETE em /autores/:id', () => {
  it('Deve excluir autor por id', async () => {
    await request(app)
      .delete(`/autores/${respostaId}`)
      .expect(200);
  });
});
