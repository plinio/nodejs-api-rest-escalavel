const Modelo = require('./ModeloTabelaProduto')
const instancia = require('../../../banco-de-dados')
module.exports = {
    listar(idFornecedor){
        return Modelo.findAll({
            where: {
                fornecedor: idFornecedor
            },
            raw: true
        })
    },
    inserir(dados){
        return Modelo.create(dados)
    },
    remover(idProduto, idFornecedor){
        return Modelo.destroy({
            where: {
                id: idProduto,
                fornecedor: idFornecedor
            }
        })
    },
    async pegarPorId(idProduto, idFornecedor){
        const encontrado = await Modelo.findOne({
            where: {
                id: idProduto,
                fornecedor: idFornecedor
            },
            raw: true //para ao inves de retornar um objeto sequelize, retornar um obj puro javascript
        })

        if(!encontrado){
            throw new Error('Produto não foi encontrado!')
        }
        return encontrado
    },
    atualizar(dadosDoProduto, dadosParaAtualizar){
        return Modelo.update(
            dadosParaAtualizar,
            {
                where: dadosDoProduto
            }
        )
    },
    subtrair(idProduto, idFornecedor, campo, quantidade){
        return instancia.transaction(async transacao => {// usando instancia do banco para evitar concorrencia (muitas pessoas acessando a API para diminuir o estoque, por exemplo)
            const produto = await Modelo.findOne({
                where: {
                    id: idProduto,
                    fornecedor: idFornecedor
                }
            })
        
            produto[campo] = quantidade
            await produto.save()
            return produto
        })
    }
}