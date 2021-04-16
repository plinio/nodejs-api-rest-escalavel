const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor

//liberando rota api/fornecedores/ para executar métodos no console do navegador
roteador.options('/',(requisicao,resposta)=>{
    resposta.set('Access-Control-Allow-Methods', 'GET')
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


module.exports = roteador

