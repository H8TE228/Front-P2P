import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const linkColumns = [
  {
    title: "Платформа",
    links: ["О компании", "Вакансии", "Реквизиты"],
  },
  {
    title: "Помощь",
    links: ["Поддержка", "Поддержка", "Правила"],
  },
  {
    title: "Сервисы",
    links: ["Совместное владение", "Совместное владение", "Безопасная сделка"],
  },
];

export function Footer() {
  return (
    <footer className="bg-footer text-footer-foreground w-full border-t border-[#E5E7EB] py-12 dark:border-[#1D293D] dark:bg-[#0F172B]">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="grid min-h-32 grid-cols-1 gap-x-8 gap-y-8 px-4 pb-3 sm:grid-cols-2 lg:grid-cols-4">
          {linkColumns.map((col) => (
            <div key={col.title} className="min-w-0">
              <h3 className="mb-[18px] text-base leading-6 font-semibold tracking-normal text-[#0F172B] dark:text-[#F1F5F9]">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((label, index) => (
                  <li key={`${col.title}-${index}`}>
                    <Link
                      to="#"
                      className="text-sm leading-5 font-normal tracking-normal text-[#62748E] transition-colors hover:text-[#0F172B] dark:text-[#90A1B9] dark:hover:text-[#F1F5F9]"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="min-w-0">
            <h3 className="mb-[18px] text-base leading-6 font-semibold tracking-normal text-[#0F172B] dark:text-[#F1F5F9]">
              Приложение
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Button
                  asChild
                  disabled
                  variant="secondary"
                  className="h-10 w-32 rounded-[10px] bg-[#E2E8F0] text-xs leading-4 font-medium text-[#45556C] hover:bg-[#CAD5E2] dark:bg-[#1D293D] dark:text-[#E2E8F0] dark:hover:bg-[#1D293D]/80"
                >
                  <Link to="#">App Store (нет)</Link>
                </Button>
              </li>
              <li>
                <Button
                  asChild
                  disabled
                  variant="secondary"
                  className="h-10 w-32 rounded-[10px] bg-[#E2E8F0] text-xs leading-4 font-medium text-[#45556C] hover:bg-[#CAD5E2] dark:bg-[#1D293D] dark:text-[#E2E8F0] dark:hover:bg-[#1D293D]/80"
                >
                  <Link to="#">Google Play (нет)</Link>
                </Button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex min-h-[49px] flex-col gap-4 border-t border-[#E5E7EB] px-4 pt-8 pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0 dark:border-[#1D293D]">
          <p className="text-xs leading-4 font-normal tracking-normal text-[#90A1B9] dark:text-[#62748E]">
            © 2026 ВещьВокруг
          </p>
          <Link
            to="#"
            className="text-xs leading-4 font-normal tracking-normal text-[#90A1B9] transition-colors hover:text-[#62748E] dark:text-[#62748E] dark:hover:text-[#90A1B9]"
          >
            Пользовательское соглашение
          </Link>
        </div>
      </div>
    </footer>
  );
}
