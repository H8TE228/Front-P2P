import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ArrowRight } from "lucide-react";
import * as z from "zod";
import { useRegister } from "@/hooks";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string(),
  username: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "Необходимо принять условия",
  }),
});

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState("");
  const { mutateAsync: register, isPending } = useRegister();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phoneNumber: "+7",
      agreeToTerms: false,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setError("");
      await register({
        email: data.email,
        username: data.username,
        password: data.password,
        password2: data.confirmPassword,
        phone_number: data.phoneNumber,
        first_name: data.firstName,
        last_name: data.lastName,
      });
      form.reset();
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(
          Object.values(error.response?.data).join(" ") ??
            "Непредвиденная ошибка",
        );
      } else {
        setError("Ошибка при регистрации. Пожалуйста, попробуйте еще раз.");
      }
    }
  }

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <Card className="w-full gap-0 self-center overflow-visible rounded-[32px] border-0 bg-transparent py-0 text-[#1f2a44] shadow-none ring-0">
        <CardTitle className="mb-3 text-4xl font-semibold tracking-tight text-[#1f2a44]">
          Создать аккаунт
        </CardTitle>
        <CardDescription className="mb-8 max-w-md text-base leading-7 text-[#7687a7]">
          Присоединяйтесь к платформе для аренды и совместного владения.
        </CardDescription>
        <CardContent className="px-0">
          <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                  name="firstName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="firstName"
                        className="text-sm font-medium text-[#2d3a54]"
                      >
                        Имя
                      </FieldLabel>
                      <Input
                        {...field}
                        id="firstName"
                        type="text"
                        placeholder="Иван"
                        required
                        className="h-11 rounded-2xl border-[#e2e8f5] bg-[#f9fbff] px-4 text-base text-[#1f2a44] placeholder:text-[#9aabc7]"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="lastName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="lastName"
                        className="text-sm font-medium text-[#2d3a54]"
                      >
                        Фамилия
                      </FieldLabel>
                      <Input
                        {...field}
                        id="lastName"
                        type="text"
                        placeholder="Петров"
                        required
                        className="h-11 rounded-2xl border-[#e2e8f5] bg-[#f9fbff] px-4 text-base text-[#1f2a44] placeholder:text-[#9aabc7]"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="email"
                      className="text-sm font-medium text-[#2d3a54]"
                    >
                      Email
                    </FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="ivan@example.com"
                      required
                      className="h-11 rounded-2xl border-[#e2e8f5] bg-[#f9fbff] px-4 text-base text-[#1f2a44] placeholder:text-[#9aabc7]"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="phoneNumber"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="phoneNumber"
                      className="text-sm font-medium text-[#2d3a54]"
                    >
                      Телефон
                    </FieldLabel>
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
                          "+7" + value.slice(2).replace(/\D/g, "").slice(0, 10);

                        field.onChange(value);
                      }}
                      className="h-11 rounded-2xl border-[#e2e8f5] bg-[#f9fbff] px-4 text-base text-[#1f2a44] placeholder:text-[#9aabc7]"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="username"
                      className="text-sm font-medium text-[#2d3a54]"
                    >
                      Имя пользователя
                    </FieldLabel>
                    <Input
                      {...field}
                      id="username"
                      type="text"
                      placeholder="ivanov"
                      required
                      className="h-11 rounded-2xl border-[#e2e8f5] bg-[#f9fbff] px-4 text-base text-[#1f2a44] placeholder:text-[#9aabc7]"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="password"
                      className="text-sm font-medium text-[#2d3a54]"
                    >
                      Пароль
                    </FieldLabel>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="h-11 rounded-2xl border-[#e2e8f5] bg-[#f9fbff] px-4 text-base text-[#1f2a44] placeholder:text-[#9aabc7]"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-[#2d3a54]"
                    >
                      Подтвердите пароль
                    </FieldLabel>
                    <Input
                      {...field}
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="h-11 rounded-2xl border-[#e2e8f5] bg-[#f9fbff] px-4 text-base text-[#1f2a44] placeholder:text-[#9aabc7]"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="agreeToTerms"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-3">
                    <label className="flex items-start gap-3 text-sm leading-6 text-[#66789a]">
                      <input
                        checked={field.value}
                        onChange={(event) =>
                          field.onChange(event.target.checked)
                        }
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border border-[#d4dded] accent-[#2f62f4]"
                      />
                      <span>
                        Я принимаю условия{" "}
                        <Link
                          to="#"
                          className="font-medium text-[#2f62f4] hover:text-[#2149c9]"
                        >
                          Пользовательского соглашения
                        </Link>{" "}
                        и{" "}
                        <Link
                          to="#"
                          className="font-medium text-[#2f62f4] hover:text-[#2149c9]"
                        >
                          Политики конфиденциальности
                        </Link>
                      </span>
                    </label>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {error ? (
                <FieldDescription className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </FieldDescription>
              ) : null}
            </div>

            <div className="mt-8 flex flex-col items-center gap-6">
              <Button
                className="h-13 w-full rounded-2xl text-base font-semibold shadow-none hover:bg-[#0f4ae0]"
                type="submit"
                variant="blue"
                disabled={isPending}
              >
                Зарегистрироваться
                <ArrowRight className="ml-2 size-4" />
              </Button>

              <div className="h-px w-full bg-[#e9edf5]" />

              <FieldDescription className="text-center text-sm text-[#8a9ab5]">
                <span>Уже зарегистрированы? </span>
                <Link
                  to="/login"
                  className="font-semibold text-[#1f2a44] decoration-0! hover:text-[#1f2a44]/80!"
                >
                  Войти в систему
                </Link>
              </FieldDescription>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
