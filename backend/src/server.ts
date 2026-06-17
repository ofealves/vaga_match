import dns from "dns"
dns.setDefaultResultOrder("ipv4first")

import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { conectarBanco } from "./config/database"
import perfilRoutes from "./routes/Perfil"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ status: "VagaMatch API rodando 🚀" })
})

app.use("/api/perfil", perfilRoutes)

const PORT = process.env.PORT || 5000

const iniciar = async () => {
  await conectarBanco()
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`)
  })
}

iniciar()