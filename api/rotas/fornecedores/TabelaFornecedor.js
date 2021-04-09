const Modelo = require('./modeloTabelaFornecedor')

module.exports = {
    listar(){
        return Modelo.findAll()
    },
    inserir(fornecedor){
        return Modelo.create(fornecedor)
    },
    async pegarPorID(id){
        const encontrado = await Modelo.findOne({
            where: {
                id: id
            }
        })

        if(!encontrado){
            throw new Error('Fornecedor não encontrado')
        }

        return encontrado
    }
}