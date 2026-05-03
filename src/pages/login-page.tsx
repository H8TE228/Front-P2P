import { LoginForm } from "@/components";
import { REG_LOGIN_TEXT } from "@/constants";

export function LoginPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f5f7fb] px-4 py-6 md:px-6 md:py-10">
      <div className="mx-auto grid w-full max-w-310 overflow-hidden rounded-[36px] border border-white/70 bg-white shadow-lg lg:grid-cols-[1.15fr_0.85fr]">
        <section className="relative flex min-h-180 flex-col justify-between bg-[#f9fbfd] px-8 py-8 md:px-12 md:py-12">
          <div>
            <span className="mb-10 flex size-14 items-center justify-center rounded-2xl bg-[#155DFC] text-white shadow-[0_18px_30px_rgba(47,98,244,0.28)]">
              <span className="box-border size-6 shrink-0 rounded-[6px] border-2 border-white bg-transparent" />
            </span>

            <div className="max-w-full">
              <h1 className="text-4xl leading-tight font-semibold tracking-tight text-[#1d2740] md:text-5xl">
                Делитесь вещами
                <br />
                <span className="text-[#2f62f4]">с пользой</span> для всех
              </h1>
              <p className="mt-8 text-lg leading-8 text-[#7a8cab]">
                Платформа для безопасной аренды и совместного владения техникой,
                инструментами и спортивным инвентарем.
              </p>
            </div>

            <div className="mt-14 space-y-8">
              {REG_LOGIN_TEXT.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#dfe6f3] bg-white text-[#2f62f4] shadow-[0_10px_25px_rgba(41,61,110,0.08)]">
                    <Icon className="size-5" />
                  </div>
                  <div className="max-w-[320px]">
                    <h2 className="text-base font-semibold text-[#1f2a44]">
                      {title}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-[#7d8daa]">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="pt-12 text-sm text-[#9aa8c1]">© 2026 ВещьВокруг</p>
        </section>

        <section className="flex items-center bg-white px-6 py-8 sm:px-8 md:px-12 md:py-12">
          <LoginForm className="w-full" />
        </section>
      </div>
    </main>
  );
}
