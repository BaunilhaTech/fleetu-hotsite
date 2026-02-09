"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"
import {
    Download,
    Github,
    Loader2,
    LogOut,
    RefreshCw,
    Search,
    ShieldAlert,
    ShieldCheck,
    Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"

interface LeadRow {
    id: string
    email: string
    role: string
    fleet_size: string
    created_at: string
}

const ALLOWED_GITHUB_USERS = ["alexandremendoncaalvaro", "cgrahl"]

const ROLE_LABELS: Record<string, string> = {
    dev_lead: "Dev Lead / Tech Lead",
    staff_eng: "Staff Engineer",
    platform_eng: "Platform Engineer",
    architect: "Architect",
    head_eng: "Head of Engineering",
    other: "Other",
}

function getGithubUsername(user: User | null): string | null {
    if (!user) {
        return null
    }

    const metadata = user.user_metadata ?? {}
    const candidates = [
        metadata.user_name,
        metadata.preferred_username,
        metadata.username,
        metadata.login,
    ]

    for (const candidate of candidates) {
        if (typeof candidate === "string" && candidate.trim().length > 0) {
            return candidate.trim().toLowerCase()
        }
    }

    if (user.email) {
        return user.email.split("@")[0]?.toLowerCase() ?? null
    }

    return null
}

function formatRole(role: string): string {
    return ROLE_LABELS[role] ?? role
}

function formatDate(date: string): string {
    return new Date(date).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    })
}

export default function AdminPage() {
    const [isCheckingSession, setIsCheckingSession] = useState(Boolean(supabase))
    const [isLoadingLeads, setIsLoadingLeads] = useState(false)
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [isSigningOut, setIsSigningOut] = useState(false)
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [githubUsername, setGithubUsername] = useState<string | null>(null)
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [leads, setLeads] = useState<LeadRow[]>([])
    const [error, setError] = useState<string | null>(
        supabase ? null : "Supabase não está configurado. Verifique as variáveis de ambiente."
    )
    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [fleetFilter, setFleetFilter] = useState("all")

    const fetchLeads = useCallback(async () => {
        if (!supabase) {
            setError("Supabase não está configurado.")
            return
        }

        setIsLoadingLeads(true)
        setError(null)

        const { data, error: fetchError } = await supabase
            .from("leads")
            .select("id, email, role, fleet_size, created_at")
            .order("created_at", { ascending: false })

        if (fetchError) {
            setError(fetchError.message)
            setLeads([])
        } else {
            setLeads((data ?? []) as LeadRow[])
        }

        setIsLoadingLeads(false)
    }, [])

    useEffect(() => {
        if (!supabase) {
            return
        }
        const sb = supabase

        let isMounted = true

        const applySession = async () => {
            const { data, error: sessionError } = await sb.auth.getSession()

            if (!isMounted) {
                return
            }

            if (sessionError) {
                setError(sessionError.message)
                setIsCheckingSession(false)
                return
            }

            const user = data.session?.user ?? null
            const username = getGithubUsername(user)
            const allowed = Boolean(username && ALLOWED_GITHUB_USERS.includes(username))

            setCurrentUser(user)
            setGithubUsername(username)
            setIsAuthorized(allowed)
            setIsCheckingSession(false)

            if (allowed) {
                await fetchLeads()
            } else {
                setLeads([])
            }
        }

        applySession()

        const { data: authListener } = sb.auth.onAuthStateChange(async (_event, session) => {
            if (!isMounted) {
                return
            }

            const user = session?.user ?? null
            const username = getGithubUsername(user)
            const allowed = Boolean(username && ALLOWED_GITHUB_USERS.includes(username))

            setCurrentUser(user)
            setGithubUsername(username)
            setIsAuthorized(allowed)

            if (allowed) {
                await fetchLeads()
            } else {
                setLeads([])
            }
        })

        return () => {
            isMounted = false
            authListener.subscription.unsubscribe()
        }
    }, [fetchLeads])

    const uniqueRoles = useMemo(() => Array.from(new Set(leads.map((lead) => lead.role))), [leads])
    const uniqueFleets = useMemo(() => Array.from(new Set(leads.map((lead) => lead.fleet_size))), [leads])

    const filteredLeads = useMemo(() => {
        return leads.filter((lead) => {
            const matchSearch = search.trim().length === 0
                || lead.email.toLowerCase().includes(search.trim().toLowerCase())

            const matchRole = roleFilter === "all" || lead.role === roleFilter
            const matchFleet = fleetFilter === "all" || lead.fleet_size === fleetFilter

            return matchSearch && matchRole && matchFleet
        })
    }, [fleetFilter, leads, roleFilter, search])

    const recentLeads = useMemo(() => {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        return leads.filter((lead) => new Date(lead.created_at) >= sevenDaysAgo).length
    }, [leads])

    const handleGithubSignIn = async () => {
        if (!supabase) {
            return
        }

        setIsSigningIn(true)
        setError(null)

        const { error: signInError } = await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                // Keep the current pathname so OAuth works on subpath deployments (e.g. GitHub Pages project sites).
                redirectTo: `${window.location.origin}${window.location.pathname}`,
            },
        })

        if (signInError) {
            setError(signInError.message)
            setIsSigningIn(false)
        }
    }

    const handleSignOut = async () => {
        if (!supabase) {
            return
        }

        setIsSigningOut(true)
        setError(null)
        await supabase.auth.signOut()
        setCurrentUser(null)
        setGithubUsername(null)
        setIsAuthorized(false)
        setLeads([])
        setIsSigningOut(false)
    }

    const handleExportCsv = () => {
        const header = ["email", "role", "fleet_size", "created_at"]
        const rows = filteredLeads.map((lead) => [
            lead.email,
            lead.role,
            lead.fleet_size,
            lead.created_at,
        ])
        const csv = [header, ...rows]
            .map((row) => row.map((value) => `"${String(value).replaceAll("\"", "\"\"")}"`).join(","))
            .join("\n")

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = "fleetu-cta-leads.csv"
        link.click()
        URL.revokeObjectURL(url)
    }

    return (
        <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-24 left-1/4 h-72 w-72 rounded-full bg-primary/15 blur-[120px]" />
                <div className="absolute bottom-16 right-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 md:px-6 py-10 md:py-14">
                <div className="mb-8 flex items-center justify-between gap-4">
                    <div>
                        <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            <ShieldCheck className="h-4 w-4" />
                            Fleetu Admin
                        </p>
                        <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">Painel de Leads (CTA)</h1>
                        <p className="mt-2 text-muted-foreground">
                            Acesse e gerencie quem se cadastrou no CTA com autenticação GitHub.
                        </p>
                    </div>
                    <Link href="/en" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Voltar para o site
                    </Link>
                </div>

                {isCheckingSession ? (
                    <div className="rounded-2xl border border-white/10 bg-black/35 p-10 text-center backdrop-blur-md">
                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                        <p className="mt-3 text-sm text-muted-foreground">Validando sessão...</p>
                    </div>
                ) : !currentUser ? (
                    <div className="rounded-2xl border border-white/10 bg-black/35 p-8 md:p-10 backdrop-blur-md">
                        <h2 className="text-2xl font-semibold">Acesso restrito</h2>
                        <p className="mt-2 text-muted-foreground">
                            Faça login com GitHub para acessar o painel administrativo.
                        </p>
                        <div className="mt-6">
                            <Button onClick={handleGithubSignIn} disabled={isSigningIn} className="h-11">
                                {isSigningIn ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        <Github className="h-4 w-4" />
                                        Entrar com GitHub
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                ) : !isAuthorized ? (
                    <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-8 md:p-10 backdrop-blur-md">
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/35 bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-200">
                            <ShieldAlert className="h-4 w-4" />
                            Sem permissão
                        </div>
                        <h2 className="mt-4 text-2xl font-semibold">Usuário autenticado, mas não autorizado</h2>
                        <p className="mt-2 text-muted-foreground">
                            Conta detectada: <span className="text-foreground font-medium">{githubUsername ?? "desconhecida"}</span>.
                        </p>
                        <p className="mt-1 text-muted-foreground">
                            Solicite inclusão da sua conta GitHub na allowlist do painel.
                        </p>
                        <div className="mt-6">
                            <Button variant="outline" onClick={handleSignOut} disabled={isSigningOut}>
                                {isSigningOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                                Sair
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-xl border border-white/10 bg-black/35 p-4 backdrop-blur-md">
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Total de cadastros</p>
                                <p className="mt-2 text-2xl font-semibold">{leads.length}</p>
                            </div>
                            <div className="rounded-xl border border-white/10 bg-black/35 p-4 backdrop-blur-md">
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Últimos 7 dias</p>
                                <p className="mt-2 text-2xl font-semibold">{recentLeads}</p>
                            </div>
                            <div className="rounded-xl border border-white/10 bg-black/35 p-4 backdrop-blur-md">
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Conta ativa</p>
                                <p className="mt-2 text-sm font-medium">{githubUsername}</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/35 p-4 md:p-5 backdrop-blur-md">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    Gerenciamento de inscritos do CTA
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={fetchLeads} disabled={isLoadingLeads}>
                                        {isLoadingLeads ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                                        Atualizar
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={handleExportCsv} disabled={filteredLeads.length === 0}>
                                        <Download className="h-4 w-4" />
                                        Exportar CSV
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={handleSignOut} disabled={isSigningOut}>
                                        {isSigningOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                                        Sair
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] mb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Buscar por e-mail"
                                        className="pl-9 h-11"
                                    />
                                </div>
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="h-11 rounded-md border border-input bg-background px-3 text-sm"
                                >
                                    <option value="all">Todas as funções</option>
                                    {uniqueRoles.map((role) => (
                                        <option key={role} value={role}>
                                            {formatRole(role)}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={fleetFilter}
                                    onChange={(e) => setFleetFilter(e.target.value)}
                                    className="h-11 rounded-md border border-input bg-background px-3 text-sm"
                                >
                                    <option value="all">Todos os tamanhos</option>
                                    {uniqueFleets.map((fleet) => (
                                        <option key={fleet} value={fleet}>
                                            {fleet}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-white/10">
                                <table className="w-full text-sm">
                                    <thead className="bg-white/[0.03]">
                                        <tr className="text-left">
                                            <th className="px-4 py-3 font-medium text-muted-foreground">E-mail</th>
                                            <th className="px-4 py-3 font-medium text-muted-foreground">Função</th>
                                            <th className="px-4 py-3 font-medium text-muted-foreground">Qtd de repos</th>
                                            <th className="px-4 py-3 font-medium text-muted-foreground">Data</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredLeads.map((lead) => (
                                            <tr key={lead.id} className="border-t border-white/10">
                                                <td className="px-4 py-3 font-medium">{lead.email}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{formatRole(lead.role)}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{lead.fleet_size}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{formatDate(lead.created_at)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {filteredLeads.length === 0 && (
                                    <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                                        Nenhum cadastro encontrado para os filtros atuais.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <p className="mt-4 text-sm text-red-400">{error}</p>
                )}
            </div>
        </main>
    )
}
