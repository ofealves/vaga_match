'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, BarChart3, History, User } from "lucide-react"
import { cn } from "@/lib/utils"

const itensMenu = [
    { href: "/", label: "Analisar vaga", icone: Search },
    { href: "/resultado", label: "Resultado", icone: BarChart3 },
    { href: "/historico", label: "Histórico", icone: History },
    { href: "/perfil", label: "Meu perfil", icone: User },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border flex flex-col">
                <div className="px-6 py-6">
                    <span className="text-lg font-semibold text-foreground">
                        vaga<span className="text-primary">match</span>
                    </span>
                </div>

                <nav className="flex flex-col gap-1 px-3">
                    {itensMenu.map((item) => {
                        const ativo = pathname === item.href
                        const Icone = item.icone

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                                    ativo
                                        ? "bg-primary/10 text-primary border-r-2 border-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                )}
                            >
                                <Icone className="h-4 w-4" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
            </aside>

            {/* Conteúdo principal */}
            <div className="flex-1 flex flex-col">
                <header className="h-16 border-b border-border flex items-center justify-end px-6">
                    <span className="text-sm bg-secondary text-foreground px-3 py-1.5 rounded-full">
                        Felipe Alves
                    </span>
                </header>

                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    )
}