import mongoose, { Schema, Document } from "mongoose"

export interface IExperiencia {
    cargo: string
    empresa: string
    periodo: string
    descricao: string
}

export interface IProjeto {
    nome: string
    descricao: string
    link?: string
    tecnologias: string[]
}

export interface IPerfil extends Document {
    nome: string
    resumoBase: string
    habilidades: string[]
    experiencias: IExperiencia[]
    projetos: IProjeto[]
    formacao: string
    criadoEm: Date
}

const ExperienciaSchema = new Schema<IExperiencia>({
    cargo: { type: String, required: true },
    empresa: { type: String, required: true },
    periodo: { type: String, required: true },
    descricao: { type: String, required: true },
})

const ProjetoSchema = new Schema<IProjeto>({
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    link: { type: String },
    tecnologias: [{ type: String }],
})

const PerfilSchema = new Schema<IPerfil>({
    nome: { type: String, required: true },
    resumoBase: { type: String, required: true },
    habilidades: [{ type: String }],
    experiencias: [ExperienciaSchema],
    projetos: [ProjetoSchema],
    formacao: { type: String },
    criadoEm: { type: Date, default: Date.now },
})

export default mongoose.model<IPerfil>("Perfil", PerfilSchema)