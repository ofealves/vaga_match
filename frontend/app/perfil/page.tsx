'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"

interface ExperienciaForm {
    id: string
    cargo: string
    empresa: string
    periodo: string
    descricao: string
}

interface ProjetoForm {
    id: string
    nome: string
    descricao: string
    link: string
    tecnologias: string
}

const Page = () => {
    const router = useRouter()

    const [nome, setNome] = useState("")
    const [resumoBase, setResumoBase] = useState("")
    const [habilidades, setHabilidades] = useState("")
    const [formacao, setFormacao] = useState("")
    const [experiencias, setExperiencias] = useState<ExperienciaForm[]>([])
    const [projetos, setProjetos] = useState<ProjetoForm[]>([])
    const [salvando, setSalvando] = useState(false)
    const [erro, setErro] = useState("")

    const adicionarExperiencia = () => {
        setExperiencias([
            ...experiencias,
            { id: crypto.randomUUID(), cargo: "", empresa: "", periodo: "", descricao: "" },
        ])
    }

    const removerExperiencia = (id: string) => {
        setExperiencias(experiencias.filter((exp) => exp.id !== id))
    }

    const atualizarExperiencia = (id: string, campo: keyof ExperienciaForm, valor: string) => {
        setExperiencias(
            experiencias.map((exp) => (exp.id === id ? { ...exp, [campo]: valor } : exp))
        )
    }

    const adicionarProjeto = () => {
        setProjetos([
            ...projetos,
            { id: crypto.randomUUID(), nome: "", descricao: "", link: "", tecnologias: "" },
        ])
    }

    const removerProjeto = (id: string) => {
        setProjetos(projetos.filter((proj) => proj.id !== id))
    }

    const atualizarProjeto = (id: string, campo: keyof ProjetoForm, valor: string) => {
        setProjetos(projetos.map((proj) => (proj.id === id ? { ...proj, [campo]: valor } : proj)))
    }

    const handleSalvar = async () => {
        setSalvando(true)
        setErro("")

        try {
            const habilidadesArray = habilidades
                .split(",")
                .map((h) => h.trim())
                .filter((h) => h.length > 0)

            const experienciasFormatadas = experiencias.map(({ cargo, empresa, periodo, descricao }) => ({
                cargo,
                empresa,
                periodo,
                descricao,
            }))

            const projetosFormatados = projetos.map(({ nome, descricao, link, tecnologias }) => ({
                nome,
                descricao,
                link,
                tecnologias: tecnologias
                    .split(",")
                    .map((t) => t.trim())
                    .filter((t) => t.length > 0),
            }))

            const resposta = await fetch("http://localhost:5000/api/perfil", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome,
                    resumoBase,
                    habilidades: habilidadesArray,
                    experiencias: experienciasFormatadas,
                    projetos: projetosFormatados,
                    formacao,
                }),
            })

            if (!resposta.ok) {
                throw new Error("Erro ao salvar perfil")
            }

            router.push("/")
        } catch (e) {
            setErro("Não foi possível salvar o perfil. Tente novamente.")
        } finally {
            setSalvando(false)
        }
    }

    return (
        <main className="min-h-screen bg-background flex flex-col items-center px-4 py-16">
            <h1 className="text-3xl font-semibold text-foreground mb-2">
                Seu <span className="text-primary">Perfil</span>
            </h1>
            <p className="text-muted-foreground mb-8 text-center max-w-md">
                Cadastre seus dados uma vez. Vamos usá-los para comparar com cada vaga.
            </p>

            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Informações pessoais</CardTitle>
                    <CardDescription>Dados básicos sobre você</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="nome">Nome completo</Label>
                        <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Felipe Alves" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="resumo">Resumo profissional (base)</Label>
                        <Textarea
                            id="resumo"
                            value={resumoBase}
                            onChange={(e) => setResumoBase(e.target.value)}
                            placeholder="Estudante de Engenharia de Software com foco em..."
                            className="min-h-25"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="habilidades">Habilidades (separadas por vírgula)</Label>
                        <Input
                            id="habilidades"
                            value={habilidades}
                            onChange={(e) => setHabilidades(e.target.value)}
                            placeholder="React, Next.js, TypeScript, Node.js"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="formacao">Formação</Label>
                        <Input
                            id="formacao"
                            value={formacao}
                            onChange={(e) => setFormacao(e.target.value)}
                            placeholder="Engenharia de Software (EAD) - Unicesumar, 2026"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full max-w-2xl mt-6">
                <CardHeader>
                    <CardTitle>Experiências profissionais</CardTitle>
                    <CardDescription>Adicione cada experiência separadamente</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    {experiencias.map((exp) => (
                        <div key={exp.id} className="border border-border rounded-md p-4 flex flex-col gap-3 relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => removerExperiencia(exp.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>

                            <div className="grid grid-cols-2 gap-3 pr-10">
                                <Input
                                    placeholder="Cargo"
                                    value={exp.cargo}
                                    onChange={(e) => atualizarExperiencia(exp.id, "cargo", e.target.value)}
                                />
                                <Input
                                    placeholder="Empresa"
                                    value={exp.empresa}
                                    onChange={(e) => atualizarExperiencia(exp.id, "empresa", e.target.value)}
                                />
                            </div>
                            <Input
                                placeholder="Período (ex: 2023 - 2024)"
                                value={exp.periodo}
                                onChange={(e) => atualizarExperiencia(exp.id, "periodo", e.target.value)}
                            />
                            <Textarea
                                placeholder="Descrição das atividades"
                                value={exp.descricao}
                                onChange={(e) => atualizarExperiencia(exp.id, "descricao", e.target.value)}
                                className="min-h-20"
                            />
                        </div>
                    ))}

                    <Button variant="outline" onClick={adicionarExperiencia} className="self-start">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar experiência
                    </Button>
                </CardContent>
            </Card>

            <Card className="w-full max-w-2xl mt-6">
                <CardHeader>
                    <CardTitle>Projetos</CardTitle>
                    <CardDescription>Adicione cada projeto separadamente</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    {projetos.map((proj) => (
                        <div key={proj.id} className="border border-border rounded-md p-4 flex flex-col gap-3 relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => removerProjeto(proj.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>

                            <div className="pr-10">
                                <Input
                                    placeholder="Nome do projeto"
                                    value={proj.nome}
                                    onChange={(e) => atualizarProjeto(proj.id, "nome", e.target.value)}
                                />
                            </div>
                            <Textarea
                                placeholder="Descrição do projeto"
                                value={proj.descricao}
                                onChange={(e) => atualizarProjeto(proj.id, "descricao", e.target.value)}
                                className="min-h-20"
                            />
                            <Input
                                placeholder="Link (ex: https://github.com/...)"
                                value={proj.link}
                                onChange={(e) => atualizarProjeto(proj.id, "link", e.target.value)}
                            />
                            <Input
                                placeholder="Tecnologias (separadas por vírgula)"
                                value={proj.tecnologias}
                                onChange={(e) => atualizarProjeto(proj.id, "tecnologias", e.target.value)}
                            />
                        </div>
                    ))}

                    <Button variant="outline" onClick={adicionarProjeto} className="self-start">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar projeto
                    </Button>
                </CardContent>
            </Card>

            {erro && <p className="text-destructive mt-4">{erro}</p>}

            <Button
                onClick={handleSalvar}
                disabled={salvando || !nome.trim() || !resumoBase.trim()}
                className="mt-6 w-full max-w-2xl"
            >
                {salvando ? "Salvando..." : "Salvar perfil"}
            </Button>
        </main>
    )
}

export default Page