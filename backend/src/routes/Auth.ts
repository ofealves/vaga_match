import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { Router } from "express"
import Usuario from "../models/Usuario"

const router = Router();
router.post("/register", async (req, res) => {
    const { email, password, nome } = req.body
    try {
        const usuarioExistente = await Usuario.findOne({ email })

        if (usuarioExistente) {
            return res.status(409).json({
                message: "Usuário ja cadastrado"
            })
        }

        const hashSenha = await bcrypt.hash(password, 10)

        const novoPerfil = await Usuario.create({
            password: hashSenha,
            email,
            nome
        })

        const token = jwt.sign(
            {
                id: novoPerfil._id,
                email: novoPerfil.email
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "7d"
            }
        )

        res.status(201).json({
            message: "Usuário criado com sucesso",
            token
        })
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao criar perfil", erro })
    }
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body

    const usuarioExistente = await Usuario.findOne({ email })

    if (!usuarioExistente) {
        return res.status(404).json({
            message: "Credenciais inválidas"
        })
    }

    const senhaCorreta = await bcrypt.compare(
        password,
        usuarioExistente.password
    )

    if (!senhaCorreta) {
        return res.status(401).json({
            message: "Senha inválida"
        })
    }

    const token = jwt.sign(
        {
            id: usuarioExistente._id,
            email: usuarioExistente.email
        },
        process.env.JWT_SECRET as string,
        {
            expiresIn: "7d"
        }
    )

    return res.status(200).json({
        message: "Login realizado com sucesso",
        token
    })
})

export default router