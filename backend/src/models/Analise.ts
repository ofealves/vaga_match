import mongoose, { Schema, Document } from "mongoose"

export interface IAnalise extends Document {
    empresa: string
    cargo: string
    textoVaga: string
    score: number
    pontosFortes: string[]
    pontosFaltantes: string[]
    resumoAdaptado: string
    criadoEm: Date
}

const AnaliseSchema = new Schema<IAnalise>({
    empresa: { type: String, required: true },
    cargo: { type: String, required: true },
    textoVaga: { type: String, required: true },
    score: { type: Number, required: true },
    pontosFortes: [{ type: String }],
    pontosFaltantes: [{ type: String }],
    resumoAdaptado: { type: String, required: true },
    criadoEm: { type: Date, default: Date.now },
})

export default mongoose.model<IAnalise>("Analise", AnaliseSchema)