class NaoEncontrado extends Error{
    constructor(nome){
        super(`${nome} não foi encontrado!`)//construtor da classe Error
        this.name = 'NaoEncontrado'
        this.idErro = 0
    }
}

module.exports = NaoEncontrado