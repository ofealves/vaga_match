import { Router } from "express"
import Perfil from "../models/Perfil"

const router = Router()

router.get("/", async (req, res) => {
    try {
        const perfil = await Perfil.findOne()

        if (!perfil) {
            return res.status(404).json({ mensagem: "Nenhum perfil cadastrado ainda" })
        }

        res.json(perfil)
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao buscar perfil", erro })
    }
})

router.post("/", async (req, res) => {
    try {
        const perfilExistente = await Perfil.findOne()

        if (perfilExistente) {
            const perfilAtualizado = await Perfil.findByIdAndUpdate(
                perfilExistente._id,
                req.body,
                { new: true }
            )
            return res.json(perfilAtualizado)
        }
        const novoPerfil = await Perfil.create(req.body)
        res.status(201).json(novoPerfil)
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao salvar perfil", erro })
    }
})

export default router