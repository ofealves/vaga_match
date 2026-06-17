import { Router } from "express"
import Perfil from "../models/Perfil"
import Analise from "../models/Analise"
import { analisarVaga } from "../services/gemini"

const router = Router()

// POST /api/analise — analisa uma vaga e salva no histórico
router.post("/", async (req, res) => {
    try {
        const { textoVaga } = req.body

        if (!textoVaga || textoVaga.trim().length === 0) {
            return res.status(400).json({ mensagem: "Texto da vaga é obrigatório" })
        }

        const perfil = await Perfil.findOne()

        if (!perfil) {
            return res.status(404).json({ mensagem: "Cadastre seu perfil antes de analisar uma vaga" })
        }

        const resultado = await analisarVaga(perfil, textoVaga)

        const novaAnalise = await Analise.create({
            empresa: resultado.empresa,
            cargo: resultado.cargo,
            textoVaga,
            score: resultado.score,
            pontosFortes: resultado.pontosFortes,
            pontosFaltantes: resultado.pontosFaltantes,
            resumoAdaptado: resultado.resumoAdaptado,
        })

        res.status(201).json(novaAnalise)
    } catch (erro) {
        console.error("Erro ao analisar vaga:", erro)
        res.status(500).json({ mensagem: "Erro ao processar análise", erro: String(erro) })
    }
})

// GET /api/analise — lista o histórico de análises (mais recentes primeiro)
router.get("/", async (req, res) => {
    try {
        const analises = await Analise.find().sort({ criadoEm: -1 })
        res.json(analises)
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao buscar histórico", erro })
    }
})

// GET /api/analise/:id — busca uma análise específica (pra reabrir do histórico)
router.get("/:id", async (req, res) => {
    try {
        const analise = await Analise.findById(req.params.id)

        if (!analise) {
            return res.status(404).json({ mensagem: "Análise não encontrada" })
        }

        res.json(analise)
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao buscar análise", erro })
    }
})

export default router