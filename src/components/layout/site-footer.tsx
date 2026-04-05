const interFont =
  '"Inter Variable", Inter, system-ui, sans-serif' as const;

const linkColumns = [
  {
    title: "Платформа",
    links: ["О компании", "Вакансии", "Реквизиты"],
  },
  {
    title: "Помощь",
    links: ["Поддержка", "Безопасность", "Правила"],
  },
  {
    title: "Сервисы",
    links: [
      "Совместное владение",
      "Доставка",
      "Безопасная сделка",
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer
      className="w-full border-t border-[var(--app-border)] bg-[var(--app-surface-soft)] py-12"
      style={{ fontFamily: interFont }}
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="grid min-h-32 grid-cols-1 gap-x-8 gap-y-8 px-4 pb-3 sm:grid-cols-2 lg:grid-cols-4">
          {linkColumns.map((col) => (
            <div key={col.title} className="min-w-0">
              <h3 className="mb-[18px] text-base font-semibold leading-6 tracking-normal text-[var(--app-text)]">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((label, index) => (
                  <li key={`${col.title}-${index}`}>
                    <a
                      href="#"
                      className="text-sm font-normal leading-5 tracking-normal text-[var(--app-text-muted)] transition-colors hover:text-[var(--app-text)]"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="min-w-0">
            <h3 className="mb-[18px] text-base font-semibold leading-6 tracking-normal text-[var(--app-text)]">
              Приложение
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="#"
                  className="flex h-10 w-32 items-center justify-center rounded-[10px] bg-[var(--app-store-bg)] text-center text-xs font-medium leading-4 tracking-normal text-[var(--app-store-fg)] transition-opacity hover:opacity-90"
                >
                  App Store
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex h-10 w-32 items-center justify-center rounded-[10px] bg-[var(--app-store-bg)] text-center text-xs font-medium leading-4 tracking-normal text-[var(--app-store-fg)] transition-opacity hover:opacity-90"
                >
                  Google Play
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex min-h-[49px] flex-col gap-4 border-t border-[var(--app-border)] px-4 pt-8 pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          <p className="text-xs font-normal leading-4 tracking-normal text-[var(--app-text-subtle)]">
            © 2026 ВещьВокруг
          </p>
          <a
            href="#"
            className="text-xs font-normal leading-4 tracking-normal text-[var(--app-text-subtle)] transition-colors hover:text-[var(--app-text-muted)]"
          >
            Пользовательское соглашение
          </a>
        </div>
      </div>
    </footer>
  );
}
