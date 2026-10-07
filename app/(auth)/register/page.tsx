"use client";

import Link from "next/link";
import { startTransition, useActionState } from "react";
import { register } from "../../lib/actions/auth";
import { useForm } from "react-hook-form";

type RegisterForm = {
  username: string;
  password: string;
  repeatPassword: string;
};

// We use react-hook-form for instant client-side validation and feedback to the user.
// We use useActionState to send the form data to the server action for double-validation and performing
// the actual registration logic.
export default function Register() {
  const [errorMessage, formAction, isPending] = useActionState(
    register,
    undefined,
  );

  const {
    register: registerField, // Renamed to avoid naming conflict with server action
    handleSubmit,
    getValues,
    formState: { isValid, errors },
  } = useForm<RegisterForm>({
    mode: "onChange", // validate instantly
  });

  // 3. Trigger the form action ONLY if RHF validation passes
  const onSubmit = (data: RegisterForm) => {
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
          {...registerField("username", {
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
          {...registerField("password", {
            required: "Password is required.",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters.",
            },
            maxLength: {
              value: 64,
              message: "Password must be at most 64 characters.",
            },
            deps: ["repeatPassword"], // re-run the mismatch check when password changes
          })}
        />
        {errors.password && (
          <p className="form-field-error">{errors.password.message}</p>
        )}
        <div className="mb-4"></div>
        <label htmlFor="repeatPassword" className="form-label">
          Repeat Password
        </label>
        <input
          id="repeatPassword"
          type="password"
          className="input-field"
          {...registerField("repeatPassword", {
            required: "Please repeat your password.",
            validate: (value) =>
              value === getValues("password") || "Passwords do not match.",
          })}
        />
        {errors.repeatPassword && (
          <p className="form-field-error">{errors.repeatPassword.message}</p>
        )}
        <button
          type="submit"
          disabled={!isValid || isPending}
          className="filled-button mt-4"
        >
          <span className="material-symbols-outlined">account_circle</span>
          Register
        </button>
        {/* error stemming from server-side validation */}
        {errorMessage && <p className="form-field-error">{errorMessage}</p>}
      </form>
      <hr className="divider-spaced" />
      <div className="text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-button">
          Login here
        </Link>
      </div>
    </div>
  );
}
