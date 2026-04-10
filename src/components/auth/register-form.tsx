import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useState } from "react";
import { useRegister } from "@/hooks";
// import { useRegister } from "@/hooks";

const formSchema = z.object({
  email: z.string(),
  username: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
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
      phoneNumber: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
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
        setError(error.response?.data.error);
      } else {
        setError("Неизвестная ошибка");
      }
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full max-w-md self-center lg:max-w-2xl">
        <CardContent>
          <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="flex flex-col gap-4">
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="email"
                        className="text-base font-semibold"
                      >
                        Почта
                      </FieldLabel>
                      <Input
                        {...field}
                        id="email"
                        type="text"
                        required
                        className="bg-input-background h-12 md:text-base"
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
                        className="text-base font-semibold"
                      >
                        Имя пользователя
                      </FieldLabel>
                      <Input
                        {...field}
                        id="username"
                        type="text"
                        required
                        className="bg-input-background h-12 md:text-base"
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
                        className="text-base font-semibold"
                      >
                        Пароль
                      </FieldLabel>
                      <Input
                        {...field}
                        id="password"
                        type="password"
                        required
                        className="bg-input-background h-12 md:text-base"
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
                        className="text-base font-semibold"
                      >
                        Повторите пароль
                      </FieldLabel>
                      <Input
                        {...field}
                        id="confirmPassword"
                        type="password"
                        required
                        className="bg-input-background h-12 md:text-base"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="flex flex-col gap-4">
                <Controller
                  name="firstName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="firstName"
                        className="text-base font-semibold"
                      >
                        Имя
                      </FieldLabel>
                      <Input
                        {...field}
                        id="firstName"
                        type="text"
                        required
                        className="bg-input-background h-12 md:text-base"
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
                        className="text-base font-semibold"
                      >
                        Фамилия
                      </FieldLabel>
                      <Input
                        {...field}
                        id="lastName"
                        type="text"
                        required
                        className="bg-input-background h-12 md:text-base"
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
                        className="text-base font-semibold"
                      >
                        Номер телефона
                      </FieldLabel>
                      <Input
                        {...field}
                        id="phoneNumber"
                        type="text"
                        required
                        className="bg-input-background h-12 md:text-base"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-4">
              <Button
                className="h-12 w-full max-w-xs text-base font-semibold"
                type="submit"
                disabled={isPending}
              >
                Зарегистрироваться
              </Button>
              <FieldDescription className="text-center text-base font-semibold [&>a:hover]:text-[#5a7d5f]/90">
                <span>Уже есть аккаунт? </span>
                <Link to="/login" className="text-[#5a7d5f]">
                  Войти
                </Link>
              </FieldDescription>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
