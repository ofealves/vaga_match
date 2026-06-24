import mongoose, { Schema, Document } from "mongoose"

export interface IUsuario extends Document {
    email: string;
    nome : string;
    password: string;
}

const UsuarioSchema = new Schema<IUsuario>({
    email: { type: String, required: true },
    password: { type: String, required: true },
    nome: {type: String, required: true }
})

export default mongoose.model<IUsuario>("Usuario", UsuarioSchema)