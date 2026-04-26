import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ArrowRight } from "lucide-react";
import * as z from "zod";

import { useLogin } from "@/hooks";
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
  password: z.string(),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState("");
  const { mutateAsync: login, isPending } = useLogin();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setError("");
      await login(data);
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
    <div className={cn("flex flex-col", className)} {...props}>
      <Card className="w-full gap-0 self-center overflow-visible rounded-[32px] border-0 bg-transparent py-0 text-[#1f2a44] shadow-none ring-0">
        <CardTitle className="mb-3 text-4xl font-semibold tracking-tight text-[#1f2a44]">
          С возвращением!
        </CardTitle>
        <CardDescription className="mb-8 max-w-md text-base leading-7 text-[#7687a7]">
          Войдите в свой аккаунт, чтобы продолжить работу с сервисом.
        </CardDescription>
        <CardContent className="px-0">
          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="email"
                      className="text-sm font-medium text-[#2d3a54]"
                    >
                      Email (возможно потом с возможностью других способов)
                    </FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="ivan@example.com"
                      required
                      autoComplete="email"
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
                    <div className="flex justify-between">
                      <FieldLabel
                        htmlFor="password"
                        className="text-sm font-medium text-[#2d3a54]"
                      >
                        Пароль
                      </FieldLabel>
                      <Link
                        to="/forgot-password"
                        className="w-fit text-sm font-medium text-[#2f62f4] hover:text-[#2149c9]"
                      >
                        Забыли пароль?
                      </Link>
                    </div>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      className="h-11 rounded-2xl border-[#e2e8f5] bg-[#f9fbff] px-4 text-base text-[#1f2a44] placeholder:text-[#9aabc7]"
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
                    : "Произошла ошибка при входе. Пожалуйста, попробуйте еще раз."}
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
                Войти
                <ArrowRight className="ml-2 size-4" />
              </Button>

              <div className="h-px w-full bg-[#e9edf5]" />

              <FieldDescription className="text-center text-sm text-[#8a9ab5]">
                <span>Еще нет аккаунта? </span>
                <Link
                  to="/register"
                  className="font-semibold text-[#2f62f4] decoration-0! hover:text-[#2149c9]!"
                >
                  Создать аккаунт
                </Link>
              </FieldDescription>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
