import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import request from 'supertest';
import app from '../../app.js';

let server;
beforeEach(() => {
  const port = 6060;
  server = app.listen(port);
});

afterEach(() => {
  server.close();
});
let idLivro;
describe('POST em /livros', () => {
  it('Deve criar novo livro', async () => {
    const resposta = await request(app)
      .post('/livros')
      .send({
        titulo: 'O Hobbit e uma aventura inesperada',
        paginas: 500,
        editora_id: 1,
        autor_id: 1,
      })
      .expect(201);
    idLivro = resposta.body.content.id;
  });
  it('Não deve adicionar nada se não passar o corpo da requisição', async () => {
    const resposta = await request(app)
      .post('/livros')
      .send({})
      .expect(400);
  });
});
describe('GET em /livros', () => {
  it('Dever acessar todos os livros', async () => {
    const resposta = await request(app)
      .get('/livros')
      .set('Accept', 'application/json')
      .expect('content-type', /json/)
      .expect(200);
    expect(resposta.body[0].titulo).toEqual('O Hobbit');
  });
  it('Deve acessar o livro por id', async () => {
    const resposta = await request(app)
      .get(`/livros/${idLivro}`)
      .expect(200);
    expect(resposta.body.id).toBe(idLivro);
  });
});
describe('PUT em /livros', () => {
  it.each([
    ['titulo', { titulo: 'O Hobbit e uma aventura inesperada' }],
    ['paginas', { paginas: 500 }],
    ['editora', { editora_id: 1 }],
    ['autor', { autor_id: 1 }],
  ])('Deve atualizar %s', async (chave, params) => {
    const requisicao = { request };
    const spy = jest.spyOn(requisicao, 'request');
    await requisicao.request(app)
      .put(`/livros/${idLivro}`)
      .send(params)
      .expect(204);
    expect(spy).toHaveBeenCalled();
  });
});
describe('DELETE em /livros', () => {
  it('Deve deletar livro por id', async () => {
    const resposta = await request(app)
      .delete(`/livros/${idLivro}`)
      .expect(200);
    expect(resposta.body).toEqual({ message: 'livro excluído' });
  });
});
