'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles } from "lucide-react"

const Page = () => {
  const router = useRouter()
  const [vaga, setVaga] = useState("")
  const [analisando, setAnalisando] = useState(false)
  const [erro, setErro] = useState("")

  const handleAnalisar = async () => {
    setAnalisando(true)
    setErro("")

    try {
      const resposta = await fetch("http://localhost:5000/api/analise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ textoVaga: vaga }),
      })

      if (!resposta.ok) {
        const dadosErro = await resposta.json()
        throw new Error(dadosErro.mensagem || "Erro ao analisar vaga")
      }

      const analise = await resposta.json()
      router.push(`/resultado/${analise._id}`)
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro inesperado ao analisar a vaga")
    } finally {
      setAnalisando(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-foreground mb-6">Analisar vaga</h1>

      <Card>
        <CardContent className="pt-6 flex flex-col gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Cole a descrição da vaga aqui</p>
            <Textarea
              value={vaga}
              onChange={(e) => setVaga(e.target.value)}
              placeholder="Buscamos um Developer Support Engineer Júnior para..."
              className="min-h-45 resize-none"
            />
          </div>

          {erro && <p className="text-destructive text-sm">{erro}</p>}
        </CardContent>
      </Card>

      <Button
        onClick={handleAnalisar}
        disabled={!vaga.trim() || analisando}
        className="mt-6"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        {analisando ? "Analisando..." : "Analisar compatibilidade"}
      </Button>
    </div>
  )
}

export default Page