const modeloTabelaFornecedor = require('../modeloTabelaFornecedor')
const Modelo = require('./ModeloTabelaProduto')
module.exports = {
    listar(idFornecedor){
        return Modelo.findAll({
            where: {
                fornecedor: idFornecedor
            }
        })
    }
}