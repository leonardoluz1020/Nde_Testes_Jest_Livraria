import { describe, expect, jest } from '@jest/globals';
import Livro from '../../models/livro.js';

describe('Testando modelo livro', () => {
  const modelLivro = {
    titulo: 'O fantastico mundo de bobby',
    paginas: 500,
    editora_id: 1,
    autor_id: 1,
  };
  let livroId;
  it('Deve instanciar novo modelo livro', () => {
    const newLivro = new Livro(modelLivro);
    expect(newLivro).toEqual(expect.objectContaining(modelLivro));
  });
  it('Deve instanciar novo modelo livro no BD', async () => {
    const newLivro = new Livro(modelLivro);
    const livroNovo = await newLivro.salvar(newLivro);
    expect(livroNovo).toEqual(expect.objectContaining({
      id: expect.any(Number),
      ...modelLivro,
      created_at: expect.any(String),
      updated_at: expect.any(String),
    }));
    livroId = livroNovo.id;
  });
  it('Deve mostrar titulo do livro cadastrado', async () => {
    const livroNovo = await Livro.pegarPeloId(livroId);
    expect(livroNovo.titulo).toEqual(modelLivro.titulo);
  });
  it('Deve atualizar livro por id', async () => {
    const body = {
      titulo: 'O Hobbit: Uma jornada inesperada',
      paginas: 850,
    };
    const livroPorId = await Livro.pegarPeloId(livroId);
    const livroAtualizado = new Livro({ ...livroPorId, ...body });
    const resposta = await livroAtualizado.salvar(livroAtualizado);
    expect(resposta[0].titulo).toEqual(body.titulo);
    expect(resposta[0].paginas).toEqual(body.paginas);
  });
  it('Deve excluir livro do BD por id', async () => {
    await Livro.excluir(livroId);
    const resposta = await Livro.pegarPeloId(livroId);
    expect(resposta).toBeUndefined();
  });
  it('Deve simular um novo livro no BD', () => {
    const novoLivroSimulado = new Livro(modelLivro);
    novoLivroSimulado.salvar = jest.fn().mockReturnValue({
      id: 36,
      titulo: 'O fantastico mundo de bobby',
      paginas: 500,
      editora_id: 1,
      autor_id: 1,
      created_at: '2022-07-01 19:49:06',
      updated_at: '2022-07-01 19:49:06',
    });
    const retorno = novoLivroSimulado.salvar();

    expect(retorno).toEqual(expect.objectContaining({
      id: expect.any(Number),
      ...modelLivro,
      created_at: expect.any(String),
      updated_at: expect.any(String),
    }));
  });
});
