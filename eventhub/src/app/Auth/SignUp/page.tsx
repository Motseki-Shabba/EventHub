"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader, UserPlus } from "lucide-react";
import styles from "./Styles/RegistrationForm.module.css";

interface FormData {
  userName: string;
  name: string;
  surname: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

interface FormErrors {
  userName?: string;
  name?: string;
  surname?: string;
  emailAddress?: string;
  password?: string;
  confirmPassword?: string;
  phoneNumber?: string;
  general?: string;
}

const AttendeeRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    userName: "",
    name: "",
    surname: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear specific error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Username validation
    if (!formData.userName.trim()) {
      newErrors.userName = "Username is required";
      isValid = false;
    } else if (formData.userName.length < 3) {
      newErrors.userName = "Username must be at least 3 characters";
      isValid = false;
    }

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    // Surname validation
    if (!formData.surname.trim()) {
      newErrors.surname = "Surname is required";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.emailAddress)) {
      newErrors.emailAddress = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (
      !/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must include uppercase, lowercase, number and special character";
      isValid = false;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsPending(true);
      setIsError(false);

      // In a real implementation, this would call your registration service
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulating API call

      setIsSuccess(true);

      // Redirect after success - simulating this with a timeout
      setTimeout(() => {
        window.location.href = "/login?registered=success";
      }, 1500);
    } catch {
      setIsError(true);
      setErrors({
        ...errors,
        general: "Registration failed. Please try again.",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.splitContainer}>
        <div className={styles.imageSide}>
          <div className={styles.imageOverlay}>
            <h2 className={styles.imageTitle}>Join Our Community</h2>
            <p className={styles.imageText}>
              Create an account to discover, attend, and host amazing events
            </p>
          </div>
        </div>

        <div className={styles.formSide}>
          <div className={styles.formHeader}>
            <h2 className={styles.title}>Create an attendee account</h2>
          </div>

          <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={handleSubmit}>
              {isSuccess && (
                <div className={styles.successAlert} role="alert">
                  <span className={styles.alertBold}>
                    Registration successful!
                  </span>{" "}
                  Redirecting to login...
                </div>
              )}

              {(isError || errors.general) && (
                <div className={styles.errorAlert} role="alert">
                  <span className={styles.alertBold}>Registration failed!</span>{" "}
                  {errors.general || "Please try again."}
                </div>
              )}

              <div className={styles.gridCols2}>
                {/* Username */}
                <div className={styles.formGroup}>
                  <label htmlFor="userName" className={styles.label}>
                    Username *
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="userName"
                      name="userName"
                      type="text"
                      autoComplete="username"
                      required
                      value={formData.userName}
                      onChange={handleChange}
                      className={`${styles.input} ${
                        errors.userName ? styles.inputError : ""
                      }`}
                    />
                    {errors.userName && (
                      <p className={styles.errorText}>{errors.userName}</p>
                    )}
                  </div>
                </div>

                {/* Phone Number */}
                <div className={styles.formGroup}>
                  <label htmlFor="phoneNumber" className={styles.label}>
                    Phone Number *
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={`${styles.input} ${
                        errors.phoneNumber ? styles.inputError : ""
                      }`}
                    />
                    {errors.phoneNumber && (
                      <p className={styles.errorText}>{errors.phoneNumber}</p>
                    )}
                  </div>
                </div>

                {/* Name */}
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    First Name *
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className={`${styles.input} ${
                        errors.name ? styles.inputError : ""
                      }`}
                    />
                    {errors.name && (
                      <p className={styles.errorText}>{errors.name}</p>
                    )}
                  </div>
                </div>

                {/* Surname */}
                <div className={styles.formGroup}>
                  <label htmlFor="surname" className={styles.label}>
                    Last Name *
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="surname"
                      name="surname"
                      type="text"
                      autoComplete="family-name"
                      required
                      value={formData.surname}
                      onChange={handleChange}
                      className={`${styles.input} ${
                        errors.surname ? styles.inputError : ""
                      }`}
                    />
                    {errors.surname && (
                      <p className={styles.errorText}>{errors.surname}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className={styles.formGroup}>
                <label htmlFor="emailAddress" className={styles.label}>
                  Email address *
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id="emailAddress"
                    name="emailAddress"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.emailAddress}
                    onChange={handleChange}
                    className={`${styles.input} ${
                      errors.emailAddress ? styles.inputError : ""
                    }`}
                  />
                  {errors.emailAddress && (
                    <p className={styles.errorText}>{errors.emailAddress}</p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>
                  Password *
                </label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`${styles.input} ${
                      errors.password ? styles.inputError : ""
                    }`}
                  />
                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className={styles.eyeIcon} />
                    ) : (
                      <Eye className={styles.eyeIcon} />
                    )}
                  </button>
                  {errors.password && (
                    <p className={styles.errorText}>{errors.password}</p>
                  )}
                </div>
              </div>

              {/* Confirm Password */}
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  Confirm Password *
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`${styles.input} ${
                      errors.confirmPassword ? styles.inputError : ""
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className={styles.errorText}>{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <button
                  type="submit"
                  disabled={isPending}
                  className={styles.submitButton}
                >
                  {isPending ? (
                    <>
                      <Loader
                        className={`${styles.spinnerIcon} ${styles.spinning}`}
                      />
                      Processing
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} />
                      Register
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className={styles.loginPrompt}>
              Already have an account?{" "}
              <Link href={"/Auth/Login"} className={styles.loginLink}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeeRegistrationForm;
