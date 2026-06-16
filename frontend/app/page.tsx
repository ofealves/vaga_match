'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

const Page = () => {
  const [vaga, setVaga] = useState("")

  const handleAnalisar = () => {
    console.log("Vaga colada:", vaga)
    // por enquanto só loga no console — depois vamos chamar a API aqui
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center px-4 py-16">
      <h1 className="text-3xl font-semibold text-foreground mb-2">
        Vaga<span className="text-primary">Match</span>
      </h1>
      <p className="text-muted-foreground mb-8">
        Cole a descrição da vaga e descubra sua compatibilidade
      </p>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Descrição da vaga</CardTitle>
          <CardDescription>
            Cole abaixo o texto completo da vaga que você quer analisar
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Textarea
            placeholder="Cole aqui a descrição da vaga..."
            value={vaga}
            onChange={(e) => setVaga(e.target.value)}
            className="min-h-[200px]"
          />
          <Button onClick={handleAnalisar} disabled={!vaga.trim()}>
            Analisar vaga
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}

export default Page