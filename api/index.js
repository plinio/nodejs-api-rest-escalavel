const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')
const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')

app.use(bodyParser.json());
const roteador = require('./rotas/fornecedores');

app.use('/api/fornecedores', roteador)

app.use((erro, requisicao, resposta, proximaFuncao) =>{
    let status = 500 //erro generico
    if(erro instanceof NaoEncontrado){
        status = 404    
    }
    if(erro instanceof CampoInvalido || erro instanceof DadosNaoFornecidos){
        status = 400  
    }
    
    resposta.status(status);
    resposta.send(JSON.stringify({
        mensagem: erro.message,
        id: erro.idErro
    }))
})

app.listen(config.get('api.porta'), () => console.log('A API está no ar'));