import { useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  MapPin,
  Search,
} from "lucide-react";
import { CATALOG_CATEGORIES } from "@/constants";
import { useCreateListing, useListingTypes } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ListingFormValues = {
  name: string;
  type: string;
  status: string;
  location: string;
  dealFormat: "rent" | "share";
  pricePerDay: string;
  maxPeople: string;
  description: string;
  characteristics: string;
  agreement: boolean;
};

const statusOptions = [
  { value: "new", label: "Новое" },
  { value: "used_ideal", label: "Б/у, идеальное" },
  { value: "used_good", label: "Б/у, хорошее" },
];

export function ListingFormPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [stepTwoValidationAttempted, setStepTwoValidationAttempted] =
    useState(false);
  const [stepFourValidationAttempted, setStepFourValidationAttempted] =
    useState(false);
  const [photos, setPhotos] = useState<Array<{ file: File; preview: string }>>(
    [],
  );
  const [photoError, setPhotoError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { mutateAsync: createListing, isPending: isCreatingListing } =
    useCreateListing();
  const { data: listingTypesData } = useListingTypes({ page_size: 200 });
  const form = useForm<ListingFormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      type: "",
      status: "new",
      location: "",
      dealFormat: "rent",
      pricePerDay: "",
      maxPeople: "",
      description: "",
      characteristics: "",
      agreement: false,
    },
  });

  const typeOptions = useMemo<Array<{ value: string; label: string }>>(() => {
    const results = Array.isArray((listingTypesData as any)?.results)
      ? (listingTypesData as any).results
      : [];
    const serverOptions = results
      .filter((item: any) => item?.id != null)
      .map((item: any) => ({
        value: String(item.id),
        label: item.category_name
          ? `${item.category_name} - ${item.name}`
          : item.name || `Тип ${item.id}`,
      }));
    if (serverOptions.length > 0) {
      return serverOptions;
    }
    return CATALOG_CATEGORIES.map((category) => ({
      value: `fallback:${category.name}`,
      label: category.name,
    }));
  }, [listingTypesData]);
  const validTypeIds = useMemo(
    () =>
      new Set(
        typeOptions
          .map((option) => Number(option.value))
          .filter((value) => Number.isFinite(value)),
      ),
    [typeOptions],
  );

  async function onStepOneNext() {
    const isValid = await form.trigger(["name", "type", "status", "location"]);
    if (!isValid) {
      return;
    }
    setStepTwoValidationAttempted(false);
    setStep(2);
  }

  async function onStepTwoNext() {
    setStepTwoValidationAttempted(true);
    const isValid = await form.trigger(["dealFormat", "pricePerDay", "maxPeople"]);
    if (!isValid) {
      return;
    }
    setStep(3);
  }

  function onStepThreeNext() {
    setStepFourValidationAttempted(false);
    setStep(4);
  }

  async function onSubmit(data: ListingFormValues) {
    if (step !== 4) {
      return;
    }
    setStepFourValidationAttempted(true);
    const isValid = await form.trigger([
      "description",
      "characteristics",
      "agreement",
    ]);
    if (!isValid) {
      return;
    }
    try {
      setSubmitError("");
      const parsedType = Number(data.type);
      if (!Number.isFinite(parsedType) || !validTypeIds.has(parsedType)) {
        setStep(1);
        setSubmitError(
          "Категории на сервере пока не загружены. Выберите категорию позже и попробуйте снова.",
        );
        return;
      }
      const createdListing = await createListing({
        type: parsedType,
        name: data.name,
        description: data.description,
        characteristics: data.characteristics,
        status: "available",
        price: data.pricePerDay,
        images: [],
      });
      const createdId =
        createdListing && typeof createdListing === "object"
          ? (createdListing as any).id
          : undefined;
      if (createdId != null) {
        const raw = localStorage.getItem("listing-deal-format-map");
        const parsed =
          raw && raw.trim().length > 0
            ? (JSON.parse(raw) as Record<string, "rent" | "coownership">)
            : {};
        parsed[String(createdId)] =
          data.dealFormat === "share" ? "coownership" : "rent";
        localStorage.setItem("listing-deal-format-map", JSON.stringify(parsed));
      }
      navigate("/profile");
    } catch (error) {
      if (error instanceof AxiosError) {
        const responseData = error.response?.data;
        const formatError = (value: unknown): string => {
          if (typeof value === "string") {
            return value;
          }
          if (Array.isArray(value)) {
            return value.map(formatError).join(" ");
          }
          if (value && typeof value === "object") {
            return Object.values(value as Record<string, unknown>)
              .map(formatError)
              .join(" ");
          }
          return "";
        };
        setSubmitError(
          formatError(responseData) || "Ошибка при публикации объявления",
        );
      } else {
        setSubmitError("Ошибка при публикации объявления");
      }
    }
  }

  function processSelectedFiles(fileList: FileList | null) {
    if (!fileList) {
      return;
    }
    const files = Array.from(fileList);
    if (files.length === 0) {
      return;
    }

    const validMime = new Set(["image/jpeg", "image/png"]);
    const maxSize = 5 * 1024 * 1024;

    const validFiles = files.filter(
      (file) => validMime.has(file.type) && file.size <= maxSize,
    );
    const currentCount = photos.length;
    const availableSlots = Math.max(0, 10 - currentCount);
    const filesToAdd = validFiles.slice(0, availableSlots);

    if (filesToAdd.length === 0) {
      setPhotoError("Можно загрузить только JPEG/PNG до 5 МБ и не более 10 фото.");
      return;
    }

    const nextPhotos = filesToAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...nextPhotos]);
    setPhotoError("");

    if (filesToAdd.length < files.length) {
      setPhotoError("Часть файлов пропущена: поддерживаются JPEG/PNG до 5 МБ.");
    }
  }

  const photoSlotsCount = Math.min(10, Math.max(3, photos.length + 1));

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f8fafc] px-4 pb-10 pt-8 dark:bg-[#020618] md:px-6">
      <div className="mx-auto w-full max-w-[768px]">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => navigate(-1)}
            className="size-10 rounded-[14px] bg-[#f1f5f9] text-[#0f172b] hover:bg-[#e5ebf3] dark:bg-[#0f172b] dark:text-white dark:hover:bg-[#263247]"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <h1 className="text-2xl font-bold text-[#0f172b] dark:text-white">
            Новое объявление
          </h1>
        </div>

        <div className="mt-9 grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <span
              key={index}
              className={`h-2 rounded-full ${index < step ? "bg-[#155dfc]" : "bg-[#e2e8f0] dark:bg-[#263247]"}`}
            />
          ))}
        </div>

        <section className="mt-10 rounded-3xl border border-[#e2e8f0] bg-white p-8 shadow-[0_1px_2px_-1px_rgba(0,0,0,0.10),0_1px_3px_0_rgba(0,0,0,0.10)] dark:border-white/10 dark:bg-[#0f172b] dark:shadow-none">
          {step === 1 ? (
            <h2 className="text-xl leading-7 font-bold text-[#0f172b] dark:text-white">
              Что вы хотите сдать или разделить?
            </h2>
          ) : null}
          {step === 2 ? (
            <div>
              <h2 className="text-xl leading-7 font-bold text-[#0f172b] dark:text-white">
                Формат размещения
              </h2>
              <p className="mt-1.5 text-sm leading-5 text-[#62748e] dark:text-[#90a1b9]">
                Выберите, как вы хотите монетизировать вашу вещь.
              </p>
            </div>
          ) : null}
          {step === 3 ? (
            <div>
              <h2 className="text-xl leading-7 font-bold text-[#0f172b] dark:text-white">
                Фотографии
              </h2>
              <p className="mt-1.5 text-sm leading-5 text-[#62748e] dark:text-[#90a1b9]">
                Качественные фото привлекают больше внимания. Можно загрузить до
                10 штук.
              </p>
            </div>
          ) : null}
          {step === 4 ? (
            <h2 className="text-xl leading-7 font-bold text-[#0f172b] dark:text-white">
              Описание и характеристики
            </h2>
          ) : null}

          <form
            className="mt-6 flex flex-col gap-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {step === 1 ? (
              <>
                <Controller
                  name="name"
                  control={form.control}
                  rules={{ required: "Укажите название вещи" }}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-sm font-bold text-[#0f172b] dark:text-white">
                        Что это за вещь?
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="Например: Камера Sony A7 III"
                        className="h-[50px] rounded-[14px] border-[#e2e8f0] bg-[#f8fafc] px-4 text-base text-[#0f172b] placeholder:text-[#90a1b9] dark:border-white/10 dark:bg-[#020618] dark:text-white dark:placeholder:text-[#62748e]"
                      />
                      <FieldDescription className="text-xs leading-4 text-[#62748e] dark:text-[#90a1b9]">
                        Используйте понятное название без лишних слов. Это поможет
                        людям быстрее найти вашу вещь.
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr]">
                  <Controller
                    name="type"
                    control={form.control}
                    rules={{ required: "Выберите категорию" }}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-sm font-bold text-[#0f172b] dark:text-white">
                          Категория
                        </FieldLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger
                            className="h-[50px]! w-full rounded-[14px]! border-[#e2e8f0] bg-[#f8fafc] px-4 text-base text-[#0f172b] data-placeholder:text-[#90a1b9] dark:border-white/10 dark:bg-[#020618] dark:text-white dark:data-placeholder:text-[#62748e]"
                          >
                            <SelectValue
                              placeholder={
                                typeOptions.length === 0
                                  ? "Загрузка категорий..."
                                  : "Выберите категорию"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            {typeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="status"
                    control={form.control}
                    rules={{ required: "Выберите состояние товара" }}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-sm font-bold text-[#0f172b] dark:text-white">
                          Состояние товара
                        </FieldLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-[50px]! w-full rounded-[14px]! border-[#e2e8f0] bg-[#f8fafc] px-4 text-base text-[#0f172b] data-placeholder:text-[#90a1b9] dark:border-white/10 dark:bg-[#020618] dark:text-white dark:data-placeholder:text-[#62748e]">
                            <SelectValue placeholder="Выберите состояние товара" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            {statusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                <Controller
                  name="location"
                  control={form.control}
                  rules={{ required: "Укажите местоположение" }}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-sm font-bold text-[#0f172b] dark:text-white">
                        Местоположение
                      </FieldLabel>
                      <div className="relative">
                        <MapPin className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#90a1b9] dark:text-[#62748e]" />
                        <Input
                          {...field}
                          placeholder="Город, улица, дом"
                          className="h-[50px] rounded-[14px] border-[#e2e8f0] bg-[#f8fafc] pr-14 pl-10 text-base text-[#0f172b] placeholder:text-[#90a1b9] dark:border-white/10 dark:bg-[#020618] dark:text-white dark:placeholder:text-[#62748e]"
                        />
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="outline"
                          className="absolute top-1/2 right-[9px] size-8 -translate-y-1/2 rounded-[10px] border-[#e2e8f0] bg-white shadow-[0_1px_2px_-1px_rgba(0,0,0,0.10),0_1px_3px_0_rgba(0,0,0,0.10)] active:translate-y-0 dark:border-white/10 dark:bg-[#0f172b] dark:shadow-none"
                        >
                          <Search className="size-4 text-[#62748e] dark:text-[#90a1b9]" />
                        </Button>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </>
            ) : null}
            {step === 2 ? (
              <Controller
                name="dealFormat"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-0">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {[
                        {
                          value: "rent",
                          title: "Сдать в аренду",
                          text: "Сдавайте вещь посуточно и получайте стабильный доход.",
                        },
                        {
                          value: "share",
                          title: "Продать долю",
                          text: "Разделите стоимость дорогой вещи с другими людьми.",
                        },
                      ].map((option) => {
                        const checked = field.value === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => field.onChange(option.value)}
                            className={`flex min-h-[116px] items-start gap-4 rounded-2xl border bg-[#f8fafc] px-5 py-5 text-left transition-colors dark:bg-[#020618] ${
                              checked
                                ? "border-[#155dfc] shadow-[0_0_0_1px_rgba(37,99,235,0.10)]"
                                : "border-[#e2e8f0] dark:border-white/10"
                            }`}
                          >
                            <span
                              className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                                checked
                                  ? "border-[#155dfc] bg-[#155dfc]"
                                  : "border-[#cad5e2] bg-transparent dark:border-[#62748e]"
                              }`}
                            >
                              {checked ? (
                                <Check className="size-3 text-white" />
                              ) : null}
                            </span>
                            <span className="flex flex-col">
                              <span className="text-base leading-6 font-bold text-[#0f172b] dark:text-white">
                                {option.title}
                              </span>
                              <span className="mt-1.5 text-sm leading-[22.75px] font-medium text-[#62748e] dark:text-[#90a1b9]">
                                {option.text}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                      {stepTwoValidationAttempted && fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                  </Field>
                )}
              />
            ) : null}

            {step === 2 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Controller
                  name="pricePerDay"
                  control={form.control}
                  rules={{
                    required: "Укажите стоимость аренды",
                    pattern: {
                      value: /^\d+$/,
                      message: "Только цифры",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-sm font-bold text-[#0f172b] dark:text-white">
                        Стоимость аренды (₽ / день)
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="0"
                          className="h-[50px] rounded-[14px] border-[#e2e8f0] bg-[#f8fafc] px-4 pr-10 text-base text-[#0f172b] placeholder:text-[#90a1b9] dark:border-white/10 dark:bg-[#020618] dark:text-white dark:placeholder:text-[#62748e]"
                        />
                        <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-base text-[#90a1b9] dark:text-[#62748e]">
                          ₽
                        </span>
                      </div>
                      {stepTwoValidationAttempted && fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="maxPeople"
                  control={form.control}
                  rules={{
                    required: "Укажите количество людей",
                    pattern: {
                      value: /^[1-5]$/,
                      message: "Допустимо значение от 1 до 5",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-sm font-bold text-[#0f172b] dark:text-white">
                        Сколько максимум людей
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="1-5"
                        className="h-[50px] rounded-[14px] border-[#e2e8f0] bg-[#f8fafc] px-4 text-base text-[#0f172b] placeholder:text-[#90a1b9] dark:border-white/10 dark:bg-[#020618] dark:text-white dark:placeholder:text-[#62748e]"
                      />
                      {stepTwoValidationAttempted && fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            ) : null}
            {step === 3 ? (
              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    processSelectedFiles(event.dataTransfer.files);
                  }}
                  className="flex min-h-[232px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#cad5e2] bg-[#f8fafc] px-4 py-[50px] transition-colors hover:bg-[#f1f5f9] dark:border-[#62748e] dark:bg-[#020618] dark:hover:bg-[#0b1429]"
                >
                  <span className="flex size-16 items-center justify-center rounded-2xl border border-[#e2e8f0] bg-white dark:border-white/10 dark:bg-[#0f172b]">
                    <Camera className="size-8 text-[#155dfc]" />
                  </span>
                  <span className="mt-8 text-center text-base leading-6 font-bold text-[#0f172b] dark:text-white">
                    Нажмите или перетащите фото сюда
                  </span>
                  <span className="mt-2.5 text-center text-sm leading-5 font-medium text-[#62748e] dark:text-[#90a1b9]">
                    JPEG, PNG до 5 МБ
                  </span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  multiple
                  className="hidden"
                  onChange={(event) => {
                    processSelectedFiles(event.target.files);
                    event.currentTarget.value = "";
                  }}
                />
                {photoError ? (
                  <p className="text-sm text-destructive">{photoError}</p>
                ) : null}

                <div className="flex flex-wrap gap-4">
                  {Array.from({ length: photoSlotsCount }).map((_, index) => {
                    const photo = photos[index];
                    return (
                      <div
                        key={index}
                        className="relative flex size-[121px] items-center justify-center overflow-hidden rounded-[14px] border border-[#e2e8f0] bg-[#f1f5f9] dark:border-white/10 dark:bg-[#020618]"
                      >
                        {photo ? (
                          <img
                            src={photo.preview}
                            alt={photo.file.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <Camera className="size-6 text-[#cad5e2] dark:text-[#62748e]" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
            {step === 4 ? (
              <div className="flex flex-col gap-0">
                <Controller
                  name="description"
                  control={form.control}
                  rules={{ required: "Заполните описание" }}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-sm leading-5 font-medium text-[#314158] dark:text-[#cad5e2]">
                        Описание
                      </FieldLabel>
                      <textarea
                        {...field}
                        placeholder="Опишите состояние, особенности использования, что важно знать."
                        className="min-h-[122px] w-full resize-none rounded-[14px] border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-base text-[#0f172b] outline-none placeholder:text-[#90a1b9] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:border-white/10 dark:bg-[#020618] dark:text-white dark:placeholder:text-[#62748e]"
                      />
                      {stepFourValidationAttempted && fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : null}
                    </Field>
                  )}
                />

                <Controller
                  name="characteristics"
                  control={form.control}
                  rules={{ required: "Заполните характеристики" }}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="mt-[30px]">
                      <FieldLabel className="text-sm leading-5 font-medium text-[#314158] dark:text-[#cad5e2]">
                        Характеристики
                      </FieldLabel>
                      <textarea
                        {...field}
                        placeholder="Перечислите важное: модель, комплектация, размеры, состояние и т.д."
                        className="min-h-[122px] w-full resize-none rounded-[14px] border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-base text-[#0f172b] outline-none placeholder:text-[#90a1b9] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:border-white/10 dark:bg-[#020618] dark:text-white dark:placeholder:text-[#62748e]"
                      />
                      {stepFourValidationAttempted && fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : null}
                    </Field>
                  )}
                />

                <FieldDescription className="mt-3! text-xs leading-4 text-[#62748e] dark:text-[#90a1b9]">
                  Эти поля одинаково подходят для аренды и для совладения — без
                  лишней детализации.
                </FieldDescription>

                <Controller
                  name="agreement"
                  control={form.control}
                  rules={{
                    validate: (value) =>
                      value || "Подтвердите согласие с правилами сервиса",
                  }}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="mt-6">
                      <button
                        type="button"
                        onClick={() => field.onChange(!field.value)}
                        className="flex w-full items-start rounded-[14px] border border-[#dbeafe] bg-[#eff6ff80] p-4 text-left transition-colors hover:bg-[#eff6ff] dark:border-[#263247] dark:bg-[#0b1429]"
                      >
                        <span
                          className={`mt-[2px] flex size-4 shrink-0 items-center justify-center rounded-[4px] border ${
                            field.value
                              ? "border-[#155dfc] bg-[#155dfc]"
                              : "border-[#cad5e2] bg-white dark:border-[#62748e] dark:bg-[#020618]"
                          }`}
                        >
                          {field.value ? <Check className="size-3 text-white" /> : null}
                        </span>
                        <span className="ml-3 text-sm leading-[22.75px] text-[#314158] dark:text-[#cad5e2]">
                          Нажимая «Опубликовать», вы соглашаетесь с{" "}
                          <span className="underline decoration-[#94a3b8] underline-offset-2">
                            правилами сервиса
                          </span>{" "}
                          и подтверждаете, что вещь принадлежит вам на законных
                          основаниях.
                        </span>
                      </button>
                      {stepFourValidationAttempted && fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : null}
                    </Field>
                  )}
                />
              </div>
            ) : null}
            {submitError ? (
              <FieldDescription className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {submitError}
              </FieldDescription>
            ) : null}

            <div className="mt-4 flex items-end justify-between border-t border-[#f1f5f9] pt-6 dark:border-[#263247]">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 2) {
                      setStepTwoValidationAttempted(false);
                      setStep(1);
                      return;
                    }
                    if (step === 3) {
                      setStep(2);
                      return;
                    }
                    if (step === 4) {
                      setStep(3);
                    }
                  }}
                  className="cursor-pointer text-base leading-6 font-medium text-[#45556c] transition-colors hover:text-[#334155] dark:text-[#90a1b9] dark:hover:text-white"
                >
                  Назад
                </button>
              ) : (
                <span />
              )}
              <Button
                type="button"
                onClick={
                  step === 1
                    ? onStepOneNext
                    : step === 2
                      ? onStepTwoNext
                      : step === 3
                        ? onStepThreeNext
                        : form.handleSubmit(onSubmit)
                }
                variant={step === 4 ? "default" : "blue"}
                className={`h-11 rounded-[14px] px-6 text-base font-semibold ${
                  step === 4 ? "bg-[#00a63e] text-white hover:bg-[#008a34]" : ""
                }`}
                disabled={step === 4 && isCreatingListing}
              >
                {step === 4
                  ? isCreatingListing
                    ? "Публикация..."
                    : "Опубликовать"
                  : "Дальше"}
                {step === 4 ? null : <ArrowRight className="size-4" />}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
