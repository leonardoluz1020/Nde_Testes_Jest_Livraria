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
  it('Deve mostrar o autor cadastrado', async () => {
    const resposta = await Autor.pegarPeloId(autorID);
    expect(resposta.nome).toEqual(objetoAutor.nome);
  });
  it('Deve atualizar autor existente', async () => {
    const body = { nome: 'Paulo gonçalves', nacionalidade: 'Brasileiro' };
    const autorExistente = await Autor.pegarPeloId(autorID);

    const autorUpdate = new Autor({ ...autorExistente, ...body });

    const resposta = await autorUpdate.salvar(autorUpdate);

    expect(resposta[0].nome).toEqual(autorUpdate.nome);
    expect(resposta[0].nacionalidade).toEqual(autorUpdate.nacionalidade);
  });
  it('Deve excluir autor no BD', async () => {
    await Autor.excluir(autorID);
    const resultado = await Autor.pegarPeloId(autorID);

    expect(resultado).toEqual(undefined);
  });
  it('Deve fazer uma chamada simulada ao BD', () => {
    const autorSimulado = new Autor(objetoAutor);
    autorSimulado.salvar = jest.fn().mockReturnValue({
      id: 4,
      nome: 'Paulo de andrade',
      nacionalidade: 'Portugues',
      created_at: '2023-02-23T20:05:22.707Z',
      updated_at: '2023-02-23T20:05:22.737Z',
    });

    const retorno = autorSimulado.salvar();

    expect(retorno).toEqual(expect.objectContaining({
      id: expect.any(Number),
      ...objetoAutor,
      created_at: expect.any(String),
      updated_at: expect.any(String),
    }));
  });
});
