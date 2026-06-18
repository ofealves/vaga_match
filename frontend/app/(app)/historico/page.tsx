'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AnaliseResumo {
    _id: string
    empresa: string
    cargo: string
    score: number
    criadoEm: string
}

const Page = () => {
    const router = useRouter()
    const [analises, setAnalises] = useState<AnaliseResumo[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState("")

    useEffect(() => {
        const buscarHistorico = async () => {
            try {
                const resposta = await fetch("http://localhost:5000/api/analise")

                if (!resposta.ok) {
                    throw new Error("Erro ao buscar histórico")
                }

                const dados = await resposta.json()
                setAnalises(dados)
            } catch (e) {
                setErro("Não foi possível carregar o histórico.")
            } finally {
                setCarregando(false)
            }
        }

        buscarHistorico()
    }, [])

    const formatarData = (dataISO: string) => {
        return new Date(dataISO).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    const corDoScore = (score: number) => {
        if (score >= 70) return "text-primary"
        if (score >= 40) return "text-yellow-500"
        return "text-destructive"
    }

    return (
        <div className="max-w-3xl">
            <h1 className="text-xl font-semibold text-foreground mb-1">Histórico</h1>
            <p className="text-muted-foreground text-sm mb-6">
                Todas as vagas que você já analisou
            </p>

            {carregando && <p className="text-muted-foreground">Carregando...</p>}

            {erro && <p className="text-destructive">{erro}</p>}

            {!carregando && !erro && analises.length === 0 && (
                <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                        Você ainda não analisou nenhuma vaga.
                    </CardContent>
                </Card>
            )}

            <div className="flex flex-col gap-3">
                {analises.map((analise) => (
                    <Card
                        key={analise._id}
                        className="cursor-pointer hover:border-primary transition-colors"
                        onClick={() => router.push(`/resultado/${analise._id}`)}
                    >
                        <CardContent className="pt-6 flex items-center justify-between">
                            <div>
                                <p className="font-medium text-foreground">{analise.cargo}</p>
                                <p className="text-sm text-muted-foreground">{analise.empresa}</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <Badge variant="secondary" className={corDoScore(analise.score)}>
                                    {analise.score}%
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                    {formatarData(analise.criadoEm)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default Page