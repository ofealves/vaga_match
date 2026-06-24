import dotenv from "dotenv"
dotenv.config()

import dns from "dns"
dns.setServers(["8.8.8.8", "1.1.1.1"])

import express from "express"
import cors from "cors"
import { conectarBanco } from "./config/database"
import perfilRoutes from "./routes/Perfil"
import analiseRoutes from "./routes/Analise"
import authRoutes from "./routes/Auth"

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.json({ status: "VagaMatch API rodando 🚀" })
})

app.use("/api/perfil", perfilRoutes)
app.use("/api/analise", analiseRoutes)
app.use("/api/auth", authRoutes)

const PORT = process.env.PORT || 5000

const iniciar = async () => {
    await conectarBanco()
    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`)
    })
}

iniciar()