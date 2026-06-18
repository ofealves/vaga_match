'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Check, X, Copy, ArrowLeft } from "lucide-react"

interface Analise {
    _id: string
    empresa: string
    cargo: string
    textoVaga: string
    score: number
    pontosFortes: string[]
    pontosFaltantes: string[]
    resumoAdaptado: string
    criadoEm: string
}

const Page = () => {
    const params = useParams()
    const router = useRouter()
    const [analise, setAnalise] = useState<Analise | null>(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState("")
    const [copiado, setCopiado] = useState(false)

    useEffect(() => {
        const buscarAnalise = async () => {
            try {
                const resposta = await fetch(`http://localhost:5000/api/analise/${params.id}`)

                if (!resposta.ok) {
                    throw new Error("Análise não encontrada")
                }

                const dados = await resposta.json()
                setAnalise(dados)
            } catch (e) {
                setErro("Não foi possível carregar essa análise.")
            } finally {
                setCarregando(false)
            }
        }

        buscarAnalise()
    }, [params.id])

    const handleCopiar = () => {
        if (!analise) return
        navigator.clipboard.writeText(analise.resumoAdaptado)
        setCopiado(true)
        setTimeout(() => setCopiado(false), 2000)
    }

    if (carregando) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Carregando análise...</p>
            </div>
        )
    }

    if (erro || !analise) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 h-full">
                <p className="text-destructive">{erro || "Análise não encontrada"}</p>
                <Button variant="outline" onClick={() => router.push("/")}>
                    Voltar
                </Button>
            </div>
        )
    }

    return (
        <div className="w-full max-w-5xl">
            <Button variant="ghost" onClick={() => router.push("/")} className="mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Nova análise
            </Button>

            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-foreground">
                    {analise.cargo}
                </h1>
                <p className="text-muted-foreground">{analise.empresa}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Coluna esquerda: score + gap analysis */}
                <Card>
                    <CardHeader>
                        <CardTitle>Compatibilidade</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        <div>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-4xl font-bold text-primary">{analise.score}%</span>
                                <span className="text-muted-foreground text-sm">de compatibilidade</span>
                            </div>
                            <Progress value={analise.score} />
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                Você tem
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {analise.pontosFortes.map((ponto, i) => (
                                    <Badge key={i} variant="secondary">
                                        {ponto}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                                <X className="h-4 w-4 text-destructive" />
                                Falta
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {analise.pontosFaltantes.map((ponto, i) => (
                                    <Badge key={i} variant="outline" className="border-destructive/50 text-destructive">
                                        {ponto}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Coluna direita: resumo adaptado */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Resumo adaptado</CardTitle>
                        <Button variant="ghost" size="sm" onClick={handleCopiar}>
                            <Copy className="h-4 w-4 mr-2" />
                            {copiado ? "Copiado!" : "Copiar"}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <p className="text-foreground leading-relaxed">{analise.resumoAdaptado}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Page