const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')
const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const FormatosAceitos = require('./Serializador').formatosAceitos

app.use(bodyParser.json());
const roteador = require('./rotas/fornecedores');

app.use((requisicao, resposta, proximo)=>{
    let formatoRequisitado = requisicao.header('Accept');

    if(formatoRequisitado === '*/*'){//quando o cliente nao especificar o formato, vai forçar json
        formatoRequisitado = 'application/json'
    }

    if(FormatosAceitos.indexOf(formatoRequisitado) === -1){
        resposta.status(406);
        resposta.end();
        return;
    }

    resposta.setHeader('Content-Type', formatoRequisitado);
    proximo()
});

app.use('/api/fornecedores', roteador)

app.use((erro, requisicao, resposta, proximaFuncao) =>{
    let status = 500 //erro generico
    if(erro instanceof NaoEncontrado){
        status = 404    
    }
    if(erro instanceof CampoInvalido || erro instanceof DadosNaoFornecidos){
        status = 400  
    }
    if(erro instanceof ValorNaoSuportado){
        status = 406    
    }
    
    resposta.status(status);
    resposta.send(JSON.stringify({
        mensagem: erro.message,
        id: erro.idErro
    }))
})

app.listen(config.get('api.porta'), () => console.log('A API está no ar'));