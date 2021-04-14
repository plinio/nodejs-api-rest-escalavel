const roteador = require('express').Router({mergeParams: true})
const Tabela = require('./TabelaProduto')
const roteadorReclamacoes = require('./reclamacoes')

roteador.get('/', async (requisicao, resposta)=>{
    const produtos = await Tabela.listar(requisicao.params.idFornecedor)
    resposta.send(
        JSON.stringify(produtos)
    )
})

roteador.use('/:idProduto/reclamacoes', roteadorReclamacoes)

module.exports = roteador