const roteador = require('express').Router({mergeParams: true})
const Tabela = require('./TabelaProduto')
const roteadorReclamacoes = require('./reclamacoes')
const Produto = require('./Produto')
const Serializador = require('../../../Serializador').SerializadorProduto

roteador.get('/', async (requisicao, resposta)=>{
    const produtos = await Tabela.listar(requisicao.fornecedor.id)
    const serializador = new Serializador(
        resposta.getHeader('Content-Type')
    )
    resposta.send(
        serializador.serializar(produtos)
    )
})

roteador.post('/', async (requisicao, resposta, proximo)=>{
    try {
        const idFornecedor = requisicao.fornecedor.id;
        const corpo = requisicao.body;
        const dados = Object.assign({}, corpo, {fornecedor: idFornecedor})
        const produto = new Produto(dados);
        await produto.criar();
        const serializador = new Serializador(
            resposta.getHeader('Content-Type')
        )
        resposta.status(201);
        resposta.send(
            serializador.serializar(produtos)
        )
    } catch (erro) {
        proximo(erro);
    }
})


roteador.delete('/:id', async (requisicao, resposta)=>{
    const dados = {
        id: requisicao.params.id,
        fornecedor: requisicao.fornecedor.id
    }

    const produto = new Produto(dados)
    await produto.apagar();
    
    resposta.status(204);
    resposta.end()
})

roteador.get('/:id', async (requisicao, resposta, proximo)=>{
    try {
        const dados = {
            id: requisicao.params.id,
            fornecedor: requisicao.fornecedor.id
        }
    
        const produto = new Produto(dados)
        await produto.carregar()
        const serializador = new Serializador(
            resposta.getHeader('Content-Type'),
            ['preco', 'estoque', 'fornecedor', 'dataCriacao', 'dataAtualizacao', 'versao']
        )
        resposta.send(
            serializador.serializar(produto)
        )
    } catch (error) {
        proximo(error)
    }
})

roteador.put('/:id', async (requisicao, resposta, proximo)=>{
    try {
        const dados = Object.assign(
            {},//objeto base para mergear (vazio)
            requisicao.body,//dados que vier da requisicao
            {
                id: requisicao.params.id,
                fornecedor: requisicao.fornecedor.id
            }//dados inalteráveis que vem do banco
        )
        const produto = new Produto(dados)
        await produto.atualizar()
        resposta.status(204)
        resposta.end()
    } catch (error) {
        proximo(error)
    }
})

roteador.post('/:id/diminuir-estoque', async (requisicao, resposta, proximo)=>{
    try {
        const produto = new Produto({
            id: requisicao.params.id,
            fornecedor: requisicao.fornecedor.id
        })
    
        await produto.carregar() //se o produto nao existir vai cair no  catch
        produto.estoque = produto.estoque - requisicao.body.quantidade
        await produto.diminuirEstoque()
        resposta.status(204)
        resposta.end()
    } catch (error) {
        proximo(error)
    }
})

roteador.use('/:idProduto/reclamacoes', roteadorReclamacoes)

module.exports = roteador