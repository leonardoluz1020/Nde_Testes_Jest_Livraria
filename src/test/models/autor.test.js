import {
  describe, expect, it, jest,
} from '@jest/globals';
import Autor from '../../models/autor.js';

describe('Testando o modelo autor', () => {
  const objetoAutor = {
    nome: 'Paulo de andrade',
    nacionalidade: 'Portugues',
  };
  let autorID;
  it('Deve instanciar novo autor', () => {
    const autor = new Autor(objetoAutor);
    expect(autor).toEqual(expect.objectContaining(objetoAutor));
  });
  it('Deve fazer uma chamada simulada ao BD', () => {
    const autor = new Autor(objetoAutor);

    autor.salvar = jest.fn().mockReturnValue({
      id: 5,
      nome: 'Paulo de andrade',
      nacionalidade: 'Portugues',
      created_at: '2023-22-02',
      updated_at: '2023-22-02',
    });
    const retorno = autor.salvar();

    expect(retorno).toEqual(expect.objectContaining({
      id: expect.any(Number),
      ...objetoAutor,
      created_at: expect.any(String),
      updated_at: expect.any(String),
    }));
  });
  it('Deve salvar novo autor no BD', async () => {
    const autor = new Autor(objetoAutor);
    const novoAutor = await autor.salvar();
    const resultado = await Autor.pegarPeloId(novoAutor.id);

    expect(resultado).toEqual(expect.objectContaining({
      id: expect.any(Number),
      ...objetoAutor,
      created_at: expect.any(String),
      updated_at: expect.any(String),
    }));
    autorID = resultado.id;
  });
  it('Deve excluir autor no BD', async () => {
    await Autor.excluir(autorID);
    const resultado = await Autor.pegarPeloId(autorID)

    expect(resultado).toEqual(undefined)

  });
});
