const TabelaFornecedor = require('./TabelaFornecedor')
const NaoEncontrado = require('../../erros/NaoEncontrado')
class Fornecedor{

    constructor({id, empresa, email, categoria, dataCriacao, dataAtualizacao, versao}){
        this.id = id;
        this.empresa = empresa,
        this.email = email,
        this.categoria = categoria,
        this.dataCriacao = dataCriacao,
        this.dataAtualizacao = dataAtualizacao,
        this.versao = versao
    }

    async criar(){
        this.validar();
        const resultado = await TabelaFornecedor.inserir({
            empresa: this.empresa,
            email: this.email,
            categoria: this.categoria
        })

        //após inserir ja terei os demais dados que vieram do banco e completar:
        this.id = resultado.id;
        this.dataCriacao = resultado.dataCriacao,
        this.dataAtualizacao = resultado.dataAtualizacao,
        this.versao = resultado.versao
    }

    async carregar(){
        const encontrado = await TabelaFornecedor.pegarPorID(this.id);
        this.empresa = encontrado.empresa;
        this.email = encontrado.email,
        this.categoria = encontrado.categoria,
        this.dataCriacao = encontrado.dataCriacao,
        this.dataAtualizacao = encontrado.dataAtualizacao,
        this.versao = encontrado.versao
    }

    async atualizar(){
        await TabelaFornecedor.pegarPorID(this.id)
        const campos = ['empresa', 'email', 'categoria'];
        const dadosParaAtualizar = {}

        campos.forEach((campo) =>{
            const valor = this[campo]
            if(typeof valor === 'string' && valor.length > 0){
                dadosParaAtualizar[campo] = valor
            }
        })

        if(Object.keys(dadosParaAtualizar).length ===0 ){
            throw new NaoEncontrado()
        }

        await TabelaFornecedor.atualizar(this.id, dadosParaAtualizar)
    }

    remover(){
        return TabelaFornecedor.remover(this.id)
    }

    validar(){
        const campos = ['empresa', 'email', 'categoria'];
        campos.forEach(campo => {
            const valor = this[campo];
            if(typeof valor !== 'string' || valor.length === 0){
                throw new Error(`O campo'${campo}'está inválido`)
            }
        })
    }
}

module.exports = Fornecedor