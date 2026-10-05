"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { saveUserProfile } from "../lib/actions/userUpdate";
import { useForm } from "react-hook-form";
import { UserProfileUpdate } from "../lib/schemas/user";
import { COUNTRIES } from "../lib/data/countries";
import styles from "./ProfileEditor.module.css";

export function ProfileEditorForm({
  defaultValues,
  currentPictureUrl,
}: {
  defaultValues: UserProfileUpdate;
  currentPictureUrl: string | null;
}) {
  const [errorMessage, formAction, isPending] = useActionState(
    saveUserProfile,
    undefined,
  );

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<UserProfileUpdate>({
    mode: "onChange", // validate instantly
    defaultValues,
  });

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Revokes the preview's object URL when the component unmounts.
  const previewUrlRef = useRef<string | null>(null);
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!["image/jpeg", "image/png"].includes(selected.type))
      return setFileError("Only JPG and PNG are allowed.");
    if (selected.size > 4 * 1024 * 1024)
      return setFileError("The picture must not be larger than 4MB.");
    setFileError(undefined);
    setFile(selected);
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = URL.createObjectURL(selected);
    setPreviewUrl(previewUrlRef.current);
  };

  const pictureSrc = previewUrl ?? currentPictureUrl;

  // 3. Trigger the form action ONLY if RHF validation passes
  const onSubmit = (data: UserProfileUpdate) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("age", data.age.toString());
      formData.append("gender", data.gender);
      formData.append("place_of_residence", data.place_of_residence);
      formData.append("country_of_origin", data.country_of_origin);
      if (data.description) formData.append("description", data.description);

      if (file) formData.append("profile_picture", file);

      formAction(formData);
    });
  };

  return (
    <div className={`form-box ${styles.profileEditorBox}`}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={`${styles.profilePictureSelectionBox} mb-4`}>
          <label
            htmlFor="profilePicture"
            className={styles.profilePictureUploadButton}
            title="Choose a picture"
          >
            {pictureSrc ? (
              // Plain <img>: next/image can't optimise blob: URLs.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pictureSrc} alt="Profile picture" />
            ) : (
              <span className="material-symbols-outlined">add_a_photo</span>
            )}
          </label>
          <input
            id="profilePicture"
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={onFileSelected}
          />
          <div className="flex flex-col">
            <span className="form-label">Profile Picture</span>
            <p className="text-sm">Supported formats: JPG, PNG. Max size: 4MB.</p>
            {fileError && <p className="form-field-error">{fileError}</p>}
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <div className="flex flex-col flex-1">
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              className="input-field"
              {...register("first_name", {
                required: "First name is required.",
                minLength: {
                  value: 2,
                  message: "First name must be at least 2 characters.",
                },
                maxLength: {
                  value: 32,
                  message: "First name must be at most 32 characters.",
                },
                pattern: {
                  value: /^[a-zA-Z]+$/,
                  message: "First name can only contain letters.",
                },
              })}
            />
            {errors.first_name && (
              <p className="form-field-error">{errors.first_name.message}</p>
            )}
          </div>
          <div className="flex flex-col flex-1">
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              className="input-field"
              {...register("last_name", {
                required: "Last name is required.",
                minLength: {
                  value: 2,
                  message: "Last name must be at least 2 characters.",
                },
                maxLength: {
                  value: 32,
                  message: "Last name must be at most 32 characters.",
                },
                pattern: {
                  value: /^[a-zA-Z]+$/,
                  message: "Last name can only contain letters.",
                },
              })}
            />
            {errors.last_name && (
              <p className="form-field-error">{errors.last_name.message}</p>
            )}
          </div>
        </div>
        <div className="mb-4"></div>
        <label htmlFor="age" className="form-label">
          Age
        </label>
        <input
          id="age"
          type="number"
          className="input-field"
          {...register("age", {
            required: "Age is required.",
            valueAsNumber: true,
            min: {
              value: 18,
              message: "Age must be least 18.",
            },
            max: {
              value: 120,
              message: "Age must be at most 120.",
            },
          })}
        />
        {errors.age && <p className="form-field-error">{errors.age.message}</p>}
        <div className="mb-4"></div>
        <label htmlFor="gender" className="form-label">
          Gender
        </label>
        <div className="select-wrapper">
          <select
            id="gender"
            className="input-field"
            {...register("gender", {
              required: "Gender is required.",
            })}
          >
            <option value="" disabled hidden>
              Select gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <span className="material-symbols-outlined select-icon">
            expand_more
          </span>
        </div>
        {errors.gender && (
          <p className="form-field-error">{errors.gender.message}</p>
        )}
        <div className="mb-4"></div>
        <label htmlFor="placeOfResidence" className="form-label">
          Place of Residence
        </label>
        <input
          id="placeOfResidence"
          type="text"
          className="input-field"
          {...register("place_of_residence", {
            required: "Place of residence is required.",
            minLength: {
              value: 2,
              message: "Place of residence must be at least 2 characters.",
            },
            maxLength: {
              value: 100,
              message: "Place of residence must be at most 100 characters.",
            },
          })}
        />
        {errors.place_of_residence && (
          <p className="form-field-error">
            {errors.place_of_residence.message}
          </p>
        )}
        <div className="mb-4"></div>
        <label htmlFor="countryOfOrigin" className="form-label">
          Country of Origin
        </label>
        <div className="select-wrapper">
          <select
            id="countryOfOrigin"
            className="input-field"
            {...register("country_of_origin", {
              required: "Country of origin is required.",
            })}
          >
            <option value="" disabled hidden>
              Select country
            </option>
            {COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined select-icon">
            expand_more
          </span>
        </div>
        {errors.country_of_origin && (
          <p className="form-field-error">{errors.country_of_origin.message}</p>
        )}
        <div className="mb-4"></div>
        <label htmlFor="description" className="form-label">
          Description (optional)
        </label>
        <textarea
          id="description"
          className="input-field textarea-field"
          {...register("description", {
            maxLength: {
              value: 500,
              message: "Description must be at most 500 characters.",
            },
          })}
        ></textarea>
        {errors.description && (
          <p className="form-field-error">{errors.description.message}</p>
        )}
        <div className="mb-4"></div>

        {errorMessage && <p className="form-field-error">{errorMessage}</p>}
        <button
          type="submit"
          disabled={!isValid || isPending}
          className="filled-button mt-4"
        >
          <span className="material-symbols-outlined">upload</span> Save
        </button>
      </form>
    </div>
  );
}
