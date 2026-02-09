# Admin (/admin)

O painel em `/admin` lista os inscritos do CTA (tabela `leads`) e usa login via GitHub (Supabase Auth).

## Setup (produção + local)

1. **GitHub OAuth App**
   1. GitHub → `Settings` → `Developer settings` → `OAuth Apps` → `New OAuth App`
   2. `Authorization callback URL`:
      - `https://jymruiqvbiemvuogvqbe.supabase.co/auth/v1/callback`
   3. Copie o **Client ID** e gere/copiei o **Client Secret**.

2. **Supabase provider**
   1. Supabase → `Authentication` → `Providers` → `GitHub`
   2. Ative e cole o **Client ID** / **Client Secret** do GitHub.

3. **Supabase Redirect URLs (obrigatório)**
   1. Supabase → `Authentication` → `URL Configuration`
   2. Em `Additional Redirect URLs`, adicione as URLs exatas usadas pelo app:
      - Local:
        - `http://localhost:3000/admin`
        - `http://127.0.0.1:3000/admin`
      - Produção (GitHub Pages normalmente):
        - `https://baunilhatech.github.io/fleetu-hotsite/admin`
      - Se houver domínio custom, adicione também:
        - `https://SEU-DOMINIO/admin`

4. **Variáveis no deploy (GitHub Actions)**
   - Repo → `Settings` → `Secrets and variables` → `Actions` → `Secrets`
   - Definir:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Acesso (allowlist)

- Os usuários permitidos (GitHub username) estão hardcoded em:
  - `src/app/admin/page.tsx` (`ALLOWED_GITHUB_USERS`)
  - `supabase/migrations/20260209_admin_allowed_github_read_policy.sql` (RLS de leitura)

Se precisar adicionar/remover admins, faça uma nova migration ajustando a policy (e atualize o array no UI).

## Troubleshooting rápido

- **404 no GitHub**: provider GitHub no Supabase está com `Client ID` inválido (não pode ser o nome do app).
- **"redirect_to is not allowed"**: faltou adicionar a URL exata em `Additional Redirect URLs` no Supabase.
- **"Sem permissão"**: GitHub username não está na allowlist (UI + RLS).

