"use client";

import { login } from "@/app/lib/actions/auth";
import Link from "next/link";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";

type LoginForm = {
  username: string;
  password: string;
};

// We use react-hook-form for instant client-side validation and feedback to the user.
// We use useActionState to send the form data to the server action for double-validation and performing
// the actual registration logic.
export default function Login() {
  const [errorMessage, formAction, isPending] = useActionState(
    login,
    undefined,
  );

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<LoginForm>({
    mode: "onChange", // validate instantly
  });

  // 3. Trigger the form action ONLY if RHF validation passes
  const onSubmit = (data: LoginForm) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("password", data.password);

      formAction(formData);
    });
  };

  return (
    <div className="form-box">
      {/* we intercept onSubmit to handle it before it reaches the server action */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          id="username"
          type="text"
          className="input-field"
          {...register("username", {
            required: "Username is required.",
            minLength: {
              value: 4,
              message: "Username must be at least 4 characters.",
            },
            maxLength: {
              value: 32,
              message: "Username must be at most 32 characters.",
            },
            pattern: {
              value: /^[a-zA-Z0-9_-]+$/,
              message:
                "Username can only contain letters, numbers, underscores, and hyphens.",
            },
          })}
        />
        {errors.username && (
          <p className="form-field-error">{errors.username.message}</p>
        )}
        <div className="mb-4"></div>
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="input-field"
          {...register("password", {
            required: "Password is required.",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters.",
            },
            maxLength: {
              value: 64,
              message: "Password must be at most 64 characters.",
            },
          })}
        />
        {errors.password && (
          <p className="form-field-error">{errors.password.message}</p>
        )}
        <button
          type="submit"
          disabled={!isValid || isPending}
          className="filled-button mt-4"
        >
          <span className="material-symbols-outlined">login</span>
          Login
        </button>
        {/* error stemming from server-side validation */}
        {errorMessage && <p className="form-field-error">{errorMessage}</p>}
      </form>
      <hr className="divider" />
      <div className="text-center">
        Dont have an account?{" "}
        <Link href="/register" className="text-button">
          Register here
        </Link>
      </div>
    </div>
  );
}
