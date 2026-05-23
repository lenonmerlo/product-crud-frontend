import Link from "next/link";

export default function Home() {
  return (
    <main className="auth-shell flex min-h-screen items-center px-4 py-10 sm:px-8">
      <section className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-brand/20 bg-surface/70 p-6 shadow-2xl shadow-black/10 sm:p-10 lg:p-12">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div className="animate-rise">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand/30 bg-white/70"
              >
                <span className="absolute h-3 w-3 -translate-x-0.5 rounded-full bg-accent/95" />
                <span className="absolute h-2 w-2 translate-x-1.5 translate-y-1.5 rounded-full bg-brand/90" />
              </span>
              <p className="text-xs uppercase tracking-[0.22em] text-brand/75">
                Lippaus • Case Técnico
              </p>
            </div>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight text-foreground [font-family:var(--font-geist-display)] sm:text-5xl">
              Painel de produtos com visual elegante e foco comercial
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
              Plataforma interna para cadastro, edição e organização do
              catálogo de bebidas. Acesso restrito ao time comercial e
              administrativo.
            </p>
          </div>

          <div className="animate-rise rounded-2xl border border-brand/20 bg-white/75 p-5 [animation-delay:120ms]">
            <p className="text-sm font-medium text-foreground">Acesso rápido</p>
            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="/login"
                className="btn-brand rounded-xl px-4 py-2.5 text-center text-sm font-semibold"
              >
                Entrar no painel
              </Link>
              <Link
                href="/register"
                className="rounded-xl border border-brand/35 px-4 py-2.5 text-center text-sm font-semibold text-brand transition-colors hover:bg-brand/8"
              >
                Criar conta
              </Link>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Acesso destinado ao time interno da distribuidora.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
