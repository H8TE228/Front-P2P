import { ServiceOfferingCard } from "./service-offering-card";

const offerings = [
  {
    id: "rent",
    title: "Аренда вещей",
    description:
      "Находите нужные вещи рядом, арендуйте на удобный срок и получайте подсказки по выбору, использованию и безопасности.",
    linkLabel: "Найти вещь →",
    accentCircleClassName: "bg-[#E2E8F066] dark:bg-[#1D293D80]",
  },
  {
    id: "coownership",
    title: "Совместное владение",
    description:
      "Покупайте дорогие вещи вместе с другими и пользуйтесь ими по прозрачному графику и понятным правилам.",
    linkLabel: "Узнать подробнее →",
    accentCircleClassName: "bg-[#DBEAFE99] dark:bg-[#193CB84D]",
  },
];

export function ServiceOfferingsSection() {
  return (
    <section className="mb-16 w-full">
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
        {offerings.map((item) => (
          <ServiceOfferingCard
            key={item.id}
            title={item.title}
            description={item.description}
            linkLabel={item.linkLabel}
            accentCircleClassName={item.accentCircleClassName}
          />
        ))}
      </div>
    </section>
  );
}
