const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor

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
        const serializador = new SerializadorFornecedor(resposta.getHeader('Content-Type'));
    
        resposta.send(
            serializador.serializar(fornecedor)
        )
    } catch(erro){
        proximaFuncao(erro)
    }
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

module.exports = roteador;