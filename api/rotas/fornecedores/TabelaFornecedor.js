const Modelo = require('./modeloTabelaFornecedor')

module.exports = {
    listar(){
        return Modelo.findAll({raw: true})
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
    },
    atualizar (id, dadosParaAtualizar){
        console.log("-----------vai passar no update");
        console.log(dadosParaAtualizar);
        return Modelo.update(
            dadosParaAtualizar,
            {
                where: {id: id}
            }
        )
    },
    remover (id){
        return Modelo.destroy({
            where: {id: id}
        })
    }

}