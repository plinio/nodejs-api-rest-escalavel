const roteador = require('express').Router({mergeParams: true})
const Tabela = require('./TabelaProduto')
const roteadorReclamacoes = require('./reclamacoes')
const Produto = require('./Produto')
const Serializador = require('../../../Serializador').SerializadorProduto

//liberando rota api/fornecedores/idfornecedor/produtos para executar métodos no console do navegador
roteador.options('/',(requisicao,resposta)=>{
    resposta.set('Access-Control-Allow-Methods', 'GET, POST')
    resposta.set('Access-Control-Allow-Headers', 'Content-Type')
    resposta.status(204)
    resposta.end()
})

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
        // enriquecendo a resposta com atributos de cabeçalho
        resposta.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        resposta.set('Last-Modified', timestamp)
        resposta.set('Location', `/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}`)
        // fim do enriquecimento de resposta com atributos de cabeçalho
        resposta.status(201);
        resposta.send(
            serializador.serializar(produto)
        )
    } catch (erro) {
        proximo(erro);
    }
})

//liberando rota api/fornecedores/IDpRODUTO para executar métodos no console do navegador
roteador.options('/:id',(requisicao,resposta)=>{
    resposta.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE, HEAD')
    resposta.set('Access-Control-Allow-Headers', 'Content-Type')
    resposta.status(204)
    resposta.end()
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
        // enriquecendo a resposta com atributos de cabeçalho
        resposta.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        resposta.set('Last-Modified', timestamp)
        // fim do enriquecimento de resposta com atributos de cabeçalho
        resposta.send(
            serializador.serializar(produto)
        )
    } catch (error) {
        proximo(error)
    }
})

//rota para consultar dados de cabeçaho
roteador.head('/:id', async (requisicao, resposta, proximo)=>{
    try {
        const dados = {
            id: requisicao.params.id,
            fornecedor: requisicao.fornecedor.id
        }
    
        const produto = new Produto(dados)
        await produto.carregar()
        // enriquecendo a resposta com atributos de cabeçalho
        resposta.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        resposta.set('Last-Modified', timestamp)
        // fim do enriquecimento de resposta com atributos de cabeçalho
        resposta.status(200)
        resposta.end()
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
        await produto.carregar()
        // enriquecendo a resposta com atributos de cabeçalho
        resposta.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        resposta.set('Last-Modified', timestamp)
        // fim do enriquecimento de resposta com atributos de cabeçalho
        resposta.status(204)
        resposta.end()
    } catch (error) {
        proximo(error)
    }
})

//liberando rota api/fornecedores/IDpRODUTO/diminuir-estoque para executar métodos no console do navegador
roteador.options('/:id/diminuir-estoque',(requisicao,resposta)=>{
    resposta.set('Access-Control-Allow-Methods', 'POST')
    resposta.set('Access-Control-Allow-Headers', 'Content-Type')
    resposta.status(204)
    resposta.end()
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
        await produto.carregar()
        // enriquecendo a resposta com atributos de cabeçalho
        resposta.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        resposta.set('Last-Modified', timestamp)
        // fim do enriquecimento de resposta com atributos de cabeçalho
        resposta.status(204)
        resposta.end()
    } catch (error) {
        proximo(error)
    }
})

roteador.use('/:idProduto/reclamacoes', roteadorReclamacoes)

module.exports = roteador