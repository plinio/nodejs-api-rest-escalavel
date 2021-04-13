class CampoInvalido extends Error{
    constructor(campo){
        const mensagem = `O campo '${campo}' está inválido`;
        super(mensagem)//construtor da classe Error
        this.name = 'CampoInvalido'
        this.idErro = 1
    }
}

module.exports = CampoInvalido