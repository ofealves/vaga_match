import { GoogleGenAI } from "@google/genai"
import { IPerfil } from "../models/Perfil"

export interface ResultadoAnalise {
    score: number
    pontosFortes: string[]
    pontosFaltantes: string[]
    resumoAdaptado: string
    empresa: string
    cargo: string
}

const aguardar = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const analisarVaga = async (
    perfil: IPerfil,
    textoVaga: string
): Promise<ResultadoAnalise> => {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

    const prompt = `
Você é um especialista em recrutamento e análise de currículos.

PERFIL DO CANDIDATO:
Nome: ${perfil.nome}
Resumo: ${perfil.resumoBase}
Habilidades: ${perfil.habilidades.join(", ")}
Formação: ${perfil.formacao}

Experiências:
${perfil.experiencias.map(exp => `- ${exp.cargo} na ${exp.empresa} (${exp.periodo}): ${exp.descricao}`).join("\n")}

Projetos:
${perfil.projetos.map(proj => `- ${proj.nome}: ${proj.descricao} (Tecnologias: ${proj.tecnologias.join(", ")})`).join("\n")}

DESCRIÇÃO DA VAGA:
${textoVaga}

Analise a compatibilidade entre o perfil do candidato e a vaga descrita acima.

Responda APENAS com um JSON válido, sem markdown, sem texto antes ou depois, no seguinte formato exato:
{
  "score": (número de 0 a 100 representando a compatibilidade),
  "pontosFortes": (array de strings com requisitos da vaga que o candidato atende),
  "pontosFaltantes": (array de strings com requisitos da vaga que o candidato não atende ou não tem evidência),
  "resumoAdaptado": (um resumo profissional de 3-4 frases, em português, adaptado especificamente para esta vaga, destacando os pontos do perfil mais relevantes para ela),
  "empresa": (nome da empresa extraído do texto da vaga, ou "Não identificado" se não houver),
  "cargo": (nome do cargo extraído do texto da vaga, ou "Não identificado" se não houver)
}
`

    const maxTentativas = 3
    let ultimoErro: unknown = null

    for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            })

            const textoResposta = response.text ?? ""
            const jsonLimpo = textoResposta.replace(/```json|```/g, "").trim()

            const resultado: ResultadoAnalise = JSON.parse(jsonLimpo)
            return resultado
        } catch (erro) {
            ultimoErro = erro
            const ehErroDeSobrecarga = String(erro).includes("503") || String(erro).includes("UNAVAILABLE")

            if (ehErroDeSobrecarga && tentativa < maxTentativas) {
                console.warn(`Gemini sobrecarregado, tentativa ${tentativa}/${maxTentativas}. Aguardando antes de tentar de novo...`)
                await aguardar(tentativa * 2000) // espera 2s, depois 4s, depois 6s
                continue
            }

            console.error("Erro ao chamar/parsear resposta da IA:", erro)
            throw new Error("Não foi possível completar a análise. Tente novamente em alguns instantes.")
        }
    }

    throw new Error("Não foi possível completar a análise. Tente novamente em alguns instantes.")
}