"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import type { User } from "@supabase/supabase-js"
import {
    ArrowLeft,
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
import logo from "@/assets/logo.svg"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

    // Check provider-specific identity first (most reliable)
    const githubIdentity = user.identities?.find((i) => i.provider === "github")
    if (githubIdentity?.identity_data) {
        const idData = githubIdentity.identity_data
        const idCandidates = [idData.user_name, idData.preferred_username, idData.login]
        for (const candidate of idCandidates) {
            if (typeof candidate === "string" && candidate.trim().length > 0) {
                return candidate.trim().toLowerCase()
            }
        }
    }

    // Fallback to top-level user_metadata
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

function getGithubAvatarUrl(user: User | null): string | null {
    if (!user) {
        return null
    }

    const metadata = user.user_metadata ?? {}
    const candidates = [metadata.avatar_url, metadata.picture]

    for (const candidate of candidates) {
        if (typeof candidate === "string" && candidate.trim().length > 0) {
            return candidate.trim()
        }
    }

    return null
}

function getInitials(value: string | null): string {
    if (!value) {
        return "?"
    }

    return (
        value
            .split(/[\s._-]+/g)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase())
            .join("") || "?"
    )
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

    const avatarUrl = useMemo(() => getGithubAvatarUrl(currentUser), [currentUser])

    const fetchLeads = useCallback(async () => {
        if (!supabase) {
            setError("Supabase não está configurado.")
            return
        }

        setIsLoadingLeads(true)
        setError(null)

        try {
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
        } catch (err) {
            setError(err instanceof Error ? err.message : "Falha ao carregar leads.")
            setLeads([])
        } finally {
            setIsLoadingLeads(false)
        }
    }, [])

    useEffect(() => {
        if (!supabase) {
            return
        }
        const sb = supabase

        let isMounted = true

        const applyUser = (user: User | null) => {
            const username = getGithubUsername(user)
            const allowed = Boolean(username && ALLOWED_GITHUB_USERS.includes(username))

            setCurrentUser(user)
            setGithubUsername(username)
            setIsAuthorized(allowed)

            return allowed
        }

        const applySession = async () => {
            try {
                const { data, error: sessionError } = await sb.auth.getSession()

                if (!isMounted) {
                    return
                }

                if (sessionError) {
                    setError(sessionError.message)
                    return
                }

                const allowed = applyUser(data.session?.user ?? null)

                if (allowed) {
                    await fetchLeads()
                } else {
                    setLeads([])
                }
            } catch (err) {
                if (!isMounted) {
                    return
                }
                setError(err instanceof Error ? err.message : "Falha ao verificar sessão.")
            } finally {
                if (isMounted) {
                    setIsCheckingSession(false)
                }
            }
        }

        applySession()

        const { data: authListener } = sb.auth.onAuthStateChange(async (_event, session) => {
            if (!isMounted) {
                return
            }

            const allowed = applyUser(session?.user ?? null)

            try {
                if (allowed) {
                    await fetchLeads()
                } else {
                    setLeads([])
                }
            } catch {
                // fetchLeads handles its own errors
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
            const trimmed = search.trim().toLowerCase()
            const matchSearch = trimmed.length === 0 || lead.email.toLowerCase().includes(trimmed)

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

        const redirectUrl = new URL(window.location.href)
        redirectUrl.search = ""
        redirectUrl.hash = ""
        redirectUrl.pathname = redirectUrl.pathname.replace(/\/$/, "")

        const { error: signInError } = await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                // Keep the current pathname so OAuth works on subpath deployments (e.g. GitHub Pages project sites).
                // Also avoid trailing slash mismatches vs Supabase's exact allow-list.
                redirectTo: redirectUrl.toString(),
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
        const rows = filteredLeads.map((lead) => [lead.email, lead.role, lead.fleet_size, lead.created_at])
        const csv = [header, ...rows]
            .map((row) => row.map((value) => `"${String(value).replaceAll("\"", "\"\"")}"`).join(","))
            .join("\n")

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = "fleetu-cat-leads.csv"
        link.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="min-h-screen text-foreground relative overflow-hidden">
            <div className="absolute inset-0 -z-10">
                <div className="absolute -top-24 left-1/3 h-[32rem] w-[32rem] rounded-full bg-primary/18 blur-[140px]" />
                <div className="absolute bottom-0 right-1/4 h-[26rem] w-[26rem] rounded-full bg-cyan-500/12 blur-[120px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(255,255,255,0.06),transparent_35%),radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.04),transparent_40%)]" />
            </div>

            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-8">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2">
                            <Image src={logo} alt="Fleetu Logo" width={29} height={32} className="h-8 w-auto" />
                            <span className="font-logo text-lg font-bold tracking-tight">Fleetu</span>
                        </Link>
                        <Badge variant="outline" className="border-primary/25 bg-primary/10 text-primary">
                            <ShieldCheck className="h-3 w-3" />
                            Admin
                        </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                            <Link href="/" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Site
                            </Link>
                        </Button>

                        {currentUser ? (
                            <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-2 py-1">
                                <Avatar size="sm">
                                    <AvatarImage src={avatarUrl ?? undefined} alt={githubUsername ?? "GitHub"} />
                                    <AvatarFallback>{getInitials(githubUsername)}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">{githubUsername ?? "Autenticado"}</span>
                            </div>
                        ) : null}

                        {currentUser ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSignOut}
                                disabled={isSigningOut}
                                className="gap-2"
                            >
                                {isSigningOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                                Sair
                            </Button>
                        ) : (
                            <Button onClick={handleGithubSignIn} disabled={isSigningIn} size="sm" className="gap-2">
                                {isSigningIn ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />}
                                Entrar
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 md:px-6 py-10 md:py-14">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                <ShieldCheck className="h-4 w-4" />
                                Painel interno
                            </p>
                            <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">Inscritos do CAT</h1>
                            <p className="mt-2 text-muted-foreground max-w-2xl">
                                Login via GitHub (Supabase Auth) e leitura restrita por allowlist. Exportação rápida para planilha.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={fetchLeads}
                                disabled={!isAuthorized || isLoadingLeads}
                                className="gap-2"
                            >
                                {isLoadingLeads ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                                Atualizar
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleExportCsv}
                                disabled={!isAuthorized || filteredLeads.length === 0}
                                className="gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Exportar CSV
                            </Button>
                        </div>
                    </div>

                    {isCheckingSession ? (
                        <Card className="rounded-2xl bg-black/35 border-white/10 backdrop-blur-md">
                            <CardContent className="py-12 text-center">
                                <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                                <p className="mt-3 text-sm text-muted-foreground">Validando sessão...</p>
                            </CardContent>
                        </Card>
                    ) : !currentUser ? (
                        <Card className="rounded-2xl bg-black/35 border-white/10 backdrop-blur-md">
                            <CardHeader>
                                <CardTitle className="text-2xl">Acesso restrito</CardTitle>
                                <CardDescription>
                                    Faça login com GitHub para acessar o painel administrativo.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="rounded-xl border border-white/10 bg-black/25 p-4 text-sm text-muted-foreground">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary shrink-0">
                                            <ShieldCheck className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium text-foreground">Permissão por allowlist</p>
                                            <p>
                                                Apenas as contas GitHub autorizadas visualizam os dados. Se o login funcionar mas o acesso negar, é só incluir seu usuário na lista.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <Button onClick={handleGithubSignIn} disabled={isSigningIn} className="h-11 gap-2">
                                        {isSigningIn ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />}
                                        Entrar com GitHub
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : !isAuthorized ? (
                        <Card className="rounded-2xl border-amber-500/25 bg-amber-500/10 backdrop-blur-md">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-amber-500/15 text-amber-200 border border-amber-500/35">
                                        <ShieldAlert className="h-3 w-3" />
                                        Sem permissão
                                    </Badge>
                                </div>
                                <CardTitle className="text-2xl">Autenticado, mas não autorizado</CardTitle>
                                <CardDescription>
                                    Conta detectada: <span className="text-foreground font-medium">{githubUsername ?? "desconhecida"}</span>.
                                    <br />
                                    Solicite inclusão da sua conta GitHub na allowlist do painel.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" onClick={handleSignOut} disabled={isSigningOut} className="gap-2">
                                    {isSigningOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                                    Sair
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-3">
                                <Card className="rounded-2xl bg-black/35 border-white/10 backdrop-blur-md">
                                    <CardHeader className="pb-3">
                                        <CardDescription className="text-xs uppercase tracking-wide">Total de cadastros</CardDescription>
                                        <CardTitle className="text-3xl">{leads.length}</CardTitle>
                                    </CardHeader>
                                </Card>
                                <Card className="rounded-2xl bg-black/35 border-white/10 backdrop-blur-md">
                                    <CardHeader className="pb-3">
                                        <CardDescription className="text-xs uppercase tracking-wide">Últimos 7 dias</CardDescription>
                                        <CardTitle className="text-3xl">{recentLeads}</CardTitle>
                                    </CardHeader>
                                </Card>
                                <Card className="rounded-2xl bg-black/35 border-white/10 backdrop-blur-md">
                                    <CardHeader className="pb-3">
                                        <CardDescription className="text-xs uppercase tracking-wide">Conta ativa</CardDescription>
                                        <CardTitle className="text-base font-semibold">{githubUsername}</CardTitle>
                                    </CardHeader>
                                </Card>
                            </div>

                            <Card className="rounded-2xl bg-black/35 border-white/10 backdrop-blur-md overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Users className="h-4 w-4" />
                                            Gerenciamento de inscritos
                                        </div>
                                        <Badge variant="outline" className="border-white/10 text-muted-foreground w-fit">
                                            {filteredLeads.length} visíveis
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="grid gap-3 md:grid-cols-[1fr_220px_220px]">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                placeholder="Buscar por e-mail"
                                                className="pl-9 h-11 bg-background"
                                            />
                                        </div>

                                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                                            <SelectTrigger className="h-11 w-full bg-background">
                                                <SelectValue placeholder="Todas as funções" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Todas as funções</SelectItem>
                                                {uniqueRoles.map((role) => (
                                                    <SelectItem key={role} value={role}>
                                                        {formatRole(role)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Select value={fleetFilter} onValueChange={setFleetFilter}>
                                            <SelectTrigger className="h-11 w-full bg-background">
                                                <SelectValue placeholder="Todos os tamanhos" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Todos os tamanhos</SelectItem>
                                                {uniqueFleets.map((fleet) => (
                                                    <SelectItem key={fleet} value={fleet}>
                                                        {fleet}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/20">
                                        <table className="w-full text-sm">
                                            <thead className="bg-white/[0.03]">
                                                <tr className="text-left">
                                                    <th className="px-4 py-3 font-medium text-muted-foreground">E-mail</th>
                                                    <th className="px-4 py-3 font-medium text-muted-foreground">Função</th>
                                                    <th className="px-4 py-3 font-medium text-muted-foreground">Qtd de repos</th>
                                                    <th className="px-4 py-3 font-medium text-muted-foreground">Data</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/10">
                                                {filteredLeads.map((lead) => (
                                                    <tr key={lead.id} className="hover:bg-white/[0.03] transition-colors">
                                                        <td className="px-4 py-3 font-medium">{lead.email}</td>
                                                        <td className="px-4 py-3 text-muted-foreground">{formatRole(lead.role)}</td>
                                                        <td className="px-4 py-3 text-muted-foreground">{lead.fleet_size}</td>
                                                        <td className="px-4 py-3 text-muted-foreground">{formatDate(lead.created_at)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {filteredLeads.length === 0 && (
                                            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                                                Nenhum cadastro encontrado para os filtros atuais.
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

