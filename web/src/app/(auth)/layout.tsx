export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="auth-shell min-h-screen px-4 py-8 md:px-8 md:py-10 lg:px-12">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden rounded-3xl border border-brand/20 bg-surface/70 shadow-2xl shadow-black/10 md:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-brand px-8 py-10 text-white md:flex md:flex-col md:justify-between lg:px-12 lg:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.18),transparent_40%),radial-gradient(circle_at_85%_80%,rgba(194,154,86,0.28),transparent_34%)]" />

          <div className="relative animate-rise">
            <p className="text-xs uppercase tracking-[0.24em] text-white/70">
              Painel Comercial
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span
                aria-hidden
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/35 bg-white/12"
              >
                <span className="absolute h-4 w-4 -translate-x-0.5 rounded-full bg-accent/95" />
                <span className="absolute h-2.5 w-2.5 translate-x-1.5 translate-y-1.5 rounded-full bg-white/95" />
              </span>
              <h1 className="text-3xl font-semibold leading-tight [font-family:var(--font-geist-display)] lg:text-4xl">
                Lippaus <span className="text-white/75">• Case Técnico</span>
              </h1>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/82">
              Gestão de produtos para uma distribuidora com presença forte,
              operação eficiente e atendimento profissional.
            </p>
          </div>

          <div className="relative animate-rise [animation-delay:90ms]">
            <div className="inline-flex items-center rounded-full border border-white/30 px-4 py-1.5 text-xs uppercase tracking-[0.17em] text-white/86">
              Distribuidora de Bebidas
            </div>
            <p className="mt-4 text-sm text-white/74">
              Acesso restrito para equipe comercial e administrativa.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center p-4 sm:p-8 lg:p-10">
          <div className="w-full max-w-md animate-rise">{children}</div>
        </section>
      </div>
    </main>
  );
}
