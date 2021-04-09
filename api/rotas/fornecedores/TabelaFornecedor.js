const Modelo = require('./modeloTabelaFornecedor')

module.exports = {
    listar(){
        return Modelo.findAll()
    },
    inserir(fornecedor){
        return Modelo.create(fornecedor)
    }
}