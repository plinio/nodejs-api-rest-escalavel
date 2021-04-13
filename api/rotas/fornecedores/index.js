const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const instancia = require('../../banco-de-dados')
const NaoEncontrado = require('../../erros/NaoEncontrado')

roteador.get('/', async (requisicao, resposta) => {
    //vai esperar pegar os dados para enviar a resposta
    const resultados = await TabelaFornecedor.listar()
    resposta.status(200);
    resposta.send(
        JSON.stringify(resultados)
    )
})

roteador.post('/', async (requisicao, resposta)=>{
    try {
        const dadosRecebidos = requisicao.body;
        const fornecedor = new Fornecedor(dadosRecebidos);
        await fornecedor.criar();
        resposta.status(201);
        resposta.send(
            JSON.stringify(fornecedor)
        ) 
    } catch (erro) {
        resposta.status(400);
        resposta.send(
            JSON.stringify({
                mensagem: erro.message
            })
        )
    }
    
})

roteador.get('/:idFornecedor', async (requisicao, resposta) =>{
    try{
        const id = requisicao.params.idFornecedor;
        const fornecedor = new Fornecedor({id: id});
        await fornecedor.carregar();
        resposta.status(200);
        resposta.send(
            JSON.stringify(fornecedor)
        )
    } catch(erro){
        resposta.status(404);//fornecedor nao foi encontrado
        resposta.send(
            JSON.stringify({
                mensagem: erro.message
            })
        )
    }
})

roteador.put('/:idFornecedor', async (requisicao, resposta) =>{

    try{
        const id = requisicao.params.idFornecedor;
        const dadosRecebidos = requisicao.body;
        const dados = Object.assign({}, dadosRecebidos, {id: id});
        const fornecedor = new Fornecedor(dados)
        await fornecedor.atualizar();
        resposta.status(204);//sucesso, mas sem conteúdo de retorno
        resposta.end();
    } catch(erro){
        if(erro instanceof NaoEncontrado){
            resposta.status(404);    
        }else{
            resposta.status(400);
        }
        resposta.send(JSON.stringify({
            mensagem: erro.message,
            id: erro.idErro
        }))
    }
})

roteador.delete('/:idFornecedor', async (requisicao, resposta) =>{
    
    try{
        const id = requisicao.params.idFornecedor
        const fornecedor = new Fornecedor({id: id});
        await fornecedor.carregar();
        await fornecedor.remover();
        resposta.status(204);//sucesso, mas sem conteúdo de retorno
        resposta.end();
    }catch(erro){
        resposta.status(404);
        resposta.send(JSON.stringify({
            mensagem: erro.message
        }))
    }
})

module.exports = roteador;