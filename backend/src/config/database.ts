import mongoose from "mongoose"

export const conectarBanco = async () => {
    try {
        const uri = process.env.MONGO_URI

        if (!uri) {
            throw new Error("MONGO_URI não definida no .env")
        }

        await mongoose.connect(uri)
        console.log("✅ Conectado ao MongoDB")
    } catch (erro) {
        console.error("❌ Erro ao conectar no MongoDB:", erro)
        process.exit(1)
    }
}