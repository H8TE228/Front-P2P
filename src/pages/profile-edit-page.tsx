import { ListingCard } from "@/components";
import { Button } from "@/components/ui/button";
import { useMyProducts, useProfile, useUpdateProfile } from "@/hooks";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import z from "zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Item } from "@/api/schema";

const formSchema = z.object({
  first_name: z.string(),
  phone_number: z.string(),
  city: z.string(),
  description: z.string(),
});

export function ProfileEditPage() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { data } = useProfile();
  const { data: myProducts, isLoading: isMyProductsLoading } = useMyProducts();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: data?.first_name || "",
      phone_number: data?.phone_number || "+7",
      city: data?.city || "",
      description: data?.description || "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setError("");
      await updateProfile(data);
      navigate("/my-profile");
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data.detail ?? "Непредвиденная ошибка");
      } else {
        setError("Произошла ошибка. Пожалуйста, попробуйте еще раз.");
      }
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="w-full max-w-312">
        <section className="mb-10 flex items-center gap-5 border-b pb-8">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center self-start overflow-hidden rounded-full bg-[#e2e8f0]">
            {data?.profile_picture ? (
              <img
                src={data.profile_picture}
                alt={data?.first_name || data?.username}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-semibold text-gray-600">
                {(
                  data?.first_name?.[0] ||
                  data?.username?.[0] ||
                  "?"
                ).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex h-full w-full justify-between">
            <div>
              <form
                id="edit-profile-form"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="flex flex-col gap-5">
                  <Controller
                    name="first_name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor="first_name"
                          className="text-sm font-medium text-[#2d3a54]"
                        >
                          Имя
                        </FieldLabel>
                        <Input
                          {...field}
                          id="first_name"
                          type="text"
                          placeholder="Иван"
                          required
                          className="h-11 rounded-lg border-[#E2E8F0] bg-white px-4 text-base text-[#1f2a44] placeholder:text-[#9aabc7]"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <div className="flex gap-2">
                    <Controller
                      name="phone_number"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <div className="flex justify-between">
                            <FieldLabel
                              htmlFor="phone_number"
                              className="text-sm font-medium text-[#2d3a54]"
                            >
                              Номер телефона
                            </FieldLabel>
                          </div>
                          <Input
                            {...field}
                            id="phoneNumber"
                            type="tel"
                            placeholder="+79081234567"
                            required
                            onChange={(e) => {
                              let value = e.target.value;
                              if (!value.startsWith("+7")) {
                                value = "+7";
                              }
                              value =
                                "+7" +
                                value.slice(2).replace(/\D/g, "").slice(0, 10);

                              field.onChange(value);
                            }}
                            className="h-11 rounded-lg border-[#E2E8F0] bg-white px-4 text-base text-[#1f2a44] placeholder:text-[#9aabc7]"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="city"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <div className="flex justify-between">
                            <FieldLabel
                              htmlFor="city"
                              className="text-sm font-medium text-[#2d3a54]"
                            >
                              Город
                            </FieldLabel>
                          </div>
                          <Input
                            {...field}
                            id="city"
                            type="text"
                            placeholder="Город"
                            required
                            className="h-11 rounded-lg border-[#E2E8F0] bg-white px-4 text-base text-[#1f2a44] placeholder:text-[#9aabc7]"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>

                  <Controller
                    name="description"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <div className="flex justify-between">
                          <FieldLabel
                            htmlFor="description"
                            className="text-sm font-medium text-[#2d3a54]"
                          >
                            Описание
                          </FieldLabel>
                        </div>
                        <Input
                          {...field}
                          id="description"
                          type="text"
                          placeholder="Описание"
                          required
                          className="h-11 rounded-lg border-[#E2E8F0] bg-white px-4 text-base text-[#1f2a44] placeholder:text-[#9aabc7]"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  {error ? (
                    <FieldDescription className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {typeof error === "string"
                        ? error
                        : "Произошла ошибка при сохранении. Пожалуйста, попробуйте еще раз."}
                    </FieldDescription>
                  ) : null}
                </div>
              </form>
            </div>
            <div className="flex w-full max-w-40 flex-col gap-4">
              <Button
                variant="outline"
                className="h-10 rounded-2xl border shadow-sm"
                onClick={() => navigate("/my-profile")}
              >
                <ArrowLeft className="size-4" />
                Назад
              </Button>
              <Button
                variant="outline"
                className="h-10 rounded-2xl border shadow-sm"
                type="submit"
                form="edit-profile-form"
                disabled={isPending}
              >
                <Check className="size-4" />
                Сохранить
              </Button>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="relative flex justify-between border-b">
            <div className="w-41 border-b-3 border-black pb-5">
              <h2 className="text-lg font-semibold">Мои объявления</h2>
            </div>
            <Button
              variant="blue"
              className="absolute right-0 -bottom-1/3 h-9.5 rounded-2xl border-[#155dfc] shadow-md"
              onClick={() => {
                navigate("/listing-form");
              }}
            >
              Разместить объявление
            </Button>
          </div>
        </section>

        <section className="grid min-h-104 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {!isMyProductsLoading &&
            myProducts?.results.map((p: Item) => (
              <ListingCard key={p.id} product={p} />
            ))}
          {isMyProductsLoading && (
            <div className="text-muted-foreground col-span-full text-center">
              Загрузка объявлений...
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
