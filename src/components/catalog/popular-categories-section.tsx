import { CATEGORIES } from "@/constants/constants";

export function PopularCategoriesSection() {
  return (
    <section className="mb-16 w-full">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold leading-8 tracking-[-0.6px] text-[#0F172B] dark:text-[#F1F5F9]">
          Популярные категории
        </h2>
        <button
          type="button"
          className="shrink-0 cursor-pointer border-0 bg-transparent text-sm font-medium leading-5 tracking-normal text-[#155DFC] transition-opacity hover:opacity-80 dark:text-[#51A2FF]"
        >
          Все категории
        </button>
      </div>

      <div className="mt-6 grid w-full grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {CATEGORIES.map(({ id, name, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className="flex min-h-[114px] w-full min-w-0 cursor-pointer flex-col items-center gap-3 rounded-[14px] border border-[#E2E8F0] bg-white px-4 pb-4 pt-4 text-center transition-colors hover:bg-[#F8FAFC] dark:border-[#1D293D] dark:bg-[#0F172B] dark:hover:bg-[#0F172B]"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#F8FAFC] px-3 dark:bg-[#1D293D]">
              <Icon
                className="size-6 text-[#62748E] dark:text-[#90A1B9]"
                strokeWidth={1.75}
              />
            </div>
            <span className="text-sm font-medium leading-5 tracking-normal text-[#314158] dark:text-[#CAD5E2]">
              {name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
