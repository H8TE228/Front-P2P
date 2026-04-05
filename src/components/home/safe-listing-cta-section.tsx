import { Camera, Shield } from "lucide-react";

const interFont =
  '"Inter Variable", Inter, system-ui, sans-serif' as const;

const outerShadow =
  "shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)]";
const tiltedShadow =
  "shadow-[0_8px_10px_-6px_rgba(0,0,0,0.1),0_20px_25px_-5px_rgba(0,0,0,0.1)]";

export function SafeListingCtaSection() {
  return (
    <section
      className={`mt-16 w-full rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface-card)] ${outerShadow}`}
      style={{ fontFamily: interFont }}
    >
      <div className="flex min-h-[418px] flex-col items-stretch justify-between gap-10 px-6 py-12 lg:flex-row lg:items-center lg:gap-6 lg:px-0 lg:py-0 lg:pl-[49px] lg:pr-[49px]">
        <div className="w-full max-w-[576px] shrink-0 lg:pt-[59px] lg:pb-[59px]">
          <div className="flex items-center gap-2">
            <Shield
              className="size-5 shrink-0 text-[var(--app-accent)]"
              strokeWidth={2}
              aria-hidden
            />
            <span className="text-sm font-bold uppercase leading-5 tracking-[0.35px] text-[var(--app-accent)]">
              Безопасная сделка
            </span>
          </div>

          <h2 className="mt-4 text-4xl font-bold leading-10 tracking-normal text-[var(--app-text)]">
            Сдавайте свои вещи и зарабатывайте
          </h2>

          <p className="mt-[18px] max-w-[576px] text-lg font-normal leading-[29.25px] tracking-normal text-[var(--app-text-muted)]">
            Сдавайте вещи спокойнее: платформа проверяет пользователей,
            поддерживает безопасную сделку и помогает снизить риски.
          </p>

          <button
            type="button"
            className="mt-8 h-12 min-w-[200px] rounded-[14px] bg-[var(--app-accent)] px-6 text-base font-medium leading-6 tracking-normal text-white transition-opacity hover:opacity-90"
          >
            Разместить объявление
          </button>
        </div>

        <div className="flex shrink-0 justify-center lg:justify-end lg:self-stretch lg:pt-[41px]">
          <div
            className={`flex size-80 shrink-0 -rotate-[3deg] items-center justify-center rounded-3xl border border-[var(--app-border)] border-t-[var(--app-border-soft-t)] bg-[var(--app-surface-soft)] p-10 ${tiltedShadow}`}
            aria-hidden
          >
            <Camera
              className="size-24 shrink-0 text-[var(--app-safe-cta-camera)]"
              strokeWidth={1.5}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
