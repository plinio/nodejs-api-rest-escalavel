const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor

//liberando rota api/fornecedores/ para executar métodos no console do navegador
roteador.options('/',(requisicao,resposta)=>{
    resposta.set('Access-Control-Allow-Methods', 'GET, POST')
    resposta.set('Access-Control-Allow-Headers', 'Content-Type')
    resposta.status(204)
    resposta.end()
})

roteador.get('/', async (requisicao, resposta) => {
    //vai esperar pegar os dados para enviar a resposta
    const resultados = await TabelaFornecedor.listar()
    resposta.status(200);
    const serializador = new SerializadorFornecedor(resposta.getHeader('Content-Type'));
    resposta.send(
        serializador.serializar(resultados)
    )
})

roteador.post('/', async (requisicao, resposta, proximaFuncao)=>{
    try {
        const dadosRecebidos = requisicao.body;
        const fornecedor = new Fornecedor(dadosRecebidos);
        await fornecedor.criar();
        resposta.status(201);
        const serializador = new SerializadorFornecedor(resposta.getHeader('Content-Type'));
        resposta.send(
            serializador.serializar(fornecedor)
        ) 
    } catch (erro) {
        proximaFuncao(erro)
    }
    
})

roteador.get('/:idFornecedor', async (requisicao, resposta, proximaFuncao) =>{
    try{
        const id = requisicao.params.idFornecedor;
        const fornecedor = new Fornecedor({id: id});
        await fornecedor.carregar();
        resposta.status(200);
        const serializador = new SerializadorFornecedor(
            resposta.getHeader('Content-Type'),
            ['email', 'dataCriacao','dataAtualizacao']
            );
    
        resposta.send(
            serializador.serializar(fornecedor)
        )
    } catch(erro){
        proximaFuncao(erro)
    }
})

//liberando rota api/fornecedores/idfornecedor para executar métodos no console do navegador
roteador.options('/:idFornecedor',(requisicao,resposta)=>{
    resposta.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE')
    resposta.set('Access-Control-Allow-Headers', 'Content-Type')
    resposta.status(204)
    resposta.end()
})

roteador.put('/:idFornecedor', async (requisicao, resposta, proximaFuncao) =>{

    try{
        const id = requisicao.params.idFornecedor;
        const dadosRecebidos = requisicao.body;
        const dados = Object.assign({}, dadosRecebidos, {id: id});
        const fornecedor = new Fornecedor(dados)
        await fornecedor.atualizar();
        resposta.status(204);//sucesso, mas sem conteúdo de retorno
        resposta.end();
    } catch(erro){
        proximaFuncao(erro)
    }
})

roteador.delete('/:idFornecedor', async (requisicao, resposta, proximaFuncao) =>{
    
    try{
        const id = requisicao.params.idFornecedor
        const fornecedor = new Fornecedor({id: id});
        await fornecedor.carregar();
        await fornecedor.remover();
        resposta.status(204);//sucesso, mas sem conteúdo de retorno
        resposta.end();
    }catch(erro){
        proximaFuncao(erro)
    }
})

const roteadorProdutos = require('./produtos');

const verificadorFornecedor = async (requisicao, resposta, proximo)=>{
    try{
        const id = requisicao.params.idFornecedor;
        const fornecedor = new Fornecedor({
            id: id
        })
        await fornecedor.carregar();
        requisicao.fornecedor = fornecedor
        proximo()
    }catch(erro){
        proximo(erro)
    }
}

roteador.use('/:idFornecedor/produtos', verificadorFornecedor, roteadorProdutos)

module.exports = roteador;