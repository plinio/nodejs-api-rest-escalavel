class DadosNaoFornecidos extends Error{
    constructor(){
        super('Não foram fornecidos dados para atualizar!')//construtor da classe Error
        this.name = 'DadosNaoFornecidos'
        this.idErro = 2
    }
}

module.exports = DadosNaoFornecidos