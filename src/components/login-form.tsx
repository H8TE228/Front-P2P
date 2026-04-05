import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
// import { ChangePasswordForm } from "./change-password-form";

const formSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState("");
  // const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { mutateAsync: login, isPending } = useLogin();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await login(data);
      navigate("/profile");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
        setError(error.response?.data);
      } else {
        console.error("Неизвестная ошибка", error);
        setError("Неизвестная ошибка");
      }
    }
  }

  // if (showForgotPassword) {
  //   return (
  //     <div className={cn("flex flex-col gap-6", className)} {...props}>
  //       <ChangePasswordForm
  //         isForgotPassword
  //         onSuccess={() => setShowForgotPassword(false)}
  //         onCancel={() => setShowForgotPassword(false)}
  //       />
  //     </div>
  //   );
  // }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* {error && error} */}
      <Card className="">
        <CardContent>
          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => {
                  // console.log(field);
                  // console.log(fieldState);
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="email"
                        className="text-base font-semibold"
                      >
                        Имя пользователя
                      </FieldLabel>
                      <Input
                        {...field}
                        id="email"
                        type="text"
                        placeholder=""
                        required
                        className="bg-input-background h-12 md:text-base"
                        autoComplete="email"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center justify-between">
                      <FieldLabel
                        htmlFor="password"
                        className="text-base font-semibold"
                      >
                        Пароль
                      </FieldLabel>
                      {/* <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="cursor-pointer text-sm font-medium text-[#5a7d5f] hover:text-[#5a7d5f]/90"
                      >
                        Забыли пароль?
                      </button> */}
                    </div>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      required
                      className="bg-input-background h-12 md:text-base"
                      autoComplete="password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field className="gap-4">
                <Button
                  className="h-12 cursor-pointer text-base font-semibold"
                  type="submit"
                  disabled={isPending}
                >
                  Войти
                </Button>
                <FieldDescription className="text-center text-base font-semibold [&>a:hover]:text-[#5a7d5f]/90">
                  <span>Нет аккаунта? </span>
                  <Link to="/register" className="text-[#5a7d5f]">
                    Зарегистрироваться
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
