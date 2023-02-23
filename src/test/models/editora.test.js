import {
  describe, expect, jest, it,
} from '@jest/globals';
import Editora from '../../models/editora.js';

describe('Testando o modelo editora', () => {
  const objetoEditora = {
    nome: 'CDC',
    cidade: 'Sao Paulo',
    email: 'c@c.com',
  };
  let editoraID;
  it('Deve instanciar uma nova editora', () => {
    const editora = new Editora(objetoEditora);
    expect(editora).toEqual(expect.objectContaining(objetoEditora));
  });
  it('Deve salvar editora no BD', async () => {
    const editora = new Editora(objetoEditora);
    const resposta = await editora.salvar();
    expect(resposta.nome).toBe('CDC');
    editoraID = resposta.id;
  });
  it('Deve achar editora por id', async () => {
    const editoraPorId = await Editora.pegarPeloId(editoraID);
    expect(editoraPorId).toEqual(expect.objectContaining({
      id: expect.any(Number),
      ...objetoEditora,
      created_at: expect.any(String),
      updated_at: expect.any(String),
    }));
  });
  it('Deve atualizar a editora por id', async () => {
    const body = { nome: 'Casa do Codigo', cidade: 'Belo horizonte' };
    const editoraExistente = await Editora.pegarPeloId(editoraID);
    const editoraUpdate = new Editora({ ...editoraExistente, ...body });
    const resposta = await editoraUpdate.salvar(editoraUpdate);
    expect(resposta[0].nome).toEqual(editoraUpdate.nome);
    expect(resposta[0].cidade).toEqual(body.cidade);
  });
  it('Deve excluir a editora por id', async () => {
    const resposta = await Editora.excluir(editoraID);
    expect(resposta).toBeUndefined();
  });
  it('Deve fazer uma chamada simulada ao BD', () => {
    const editora = new Editora(objetoEditora);

    editora.salvar = jest.fn().mockReturnValue({
      id: 10,
      nome: 'CDC',
      cidade: 'Sao Paulo',
      email: 'c@c.com',
      created_at: '2023-22-02',
      updated_at: '2023-22-02',
    });

    const retorno = editora.salvar();

    expect(retorno).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        ...objetoEditora,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
    );
  });
});
