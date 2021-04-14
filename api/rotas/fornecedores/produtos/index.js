const roteador = require('express').Router({mergeParams: true})
const Tabela = require('./TabelaProduto')
const roteadorReclamacoes = require('./reclamacoes')
const Produto = require('./Produto')

roteador.get('/', async (requisicao, resposta)=>{
    const produtos = await Tabela.listar(requisicao.params.idFornecedor)
    resposta.send(
        JSON.stringify(produtos)
    )
})

roteador.post('/', async (requisicao, resposta)=>{
    const idFornecedor = requisicao.params.idFornecedor;
    const corpo = requisicao.body;
    const dados = Object.assign({}, corpo, {fornecedor: idFornecedor})
    const produto = new Produto(dados);
    await produto.criar();
    resposta.status(201);
    resposta.send(produto);
})

roteador.use('/:idProduto/reclamacoes', roteadorReclamacoes)

module.exports = roteador