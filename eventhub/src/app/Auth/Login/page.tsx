"use client";

import React, { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader, LogIn } from "lucide-react";
import styles from "./Styles/LoginForm.module.css";
import { useAttendeeActions, useAttendeeState } from "@/Providers/Auth/index";
import { useRouter } from "next/navigation";

const AttendeeLoginForm: React.FC = () => {
  const [userNameOrEmailAddress, setUserNameOrEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Get authentication state and actions from context
  const { isPending, isSuccess, isError, currentRole } = useAttendeeState();
  const { loginAttendee, resetStateFlags } = useAttendeeActions();
  const router = useRouter();

  // Reset error message when input changes
  useEffect(() => {
    if (errorMessage) {
      setErrorMessage("");
    }
  }, [userNameOrEmailAddress, password]);

  // Handle successful login
  // useEffect(() => {
  //   if (isSuccess) {
  //     router.push("/AttendeeManager/Dashboard");
  //     resetStateFlags(); // Reset state after navigation
  //   }
  // }, [isSuccess, router]);

  // Reset error flags when component unmounts
  // useEffect(() => {
  //   return () => {
  //     resetStateFlags();
  //   };
  // }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!userNameOrEmailAddress.trim() || !password.trim()) {
      setErrorMessage("Please enter both username/email and password");
      return;
    }

    try {
      // Call the login function from context
      await loginAttendee({ userNameOrEmailAddress, password });
    } catch {
      // This will handle any errors not caught by the redux actions
      setErrorMessage("Login failed. Please check your credentials.");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      //toast("Authorized", "success");
      resetStateFlags();
      switch (currentRole) {
        case "attendee":
          router.push("/AttendeeManager");
          break;
        case "organizer":
          router.push("/OrganizerManager");
          break;
        // default:
        //   router.push("/applicant");
        //   break;
      }
    }
    if (isError) {
      //toast("Erorr,please check your credentials", "error");
      resetStateFlags();
    }
  }, [isSuccess, isError]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.splitContainer}>
        <div className={styles.formSide}>
          <div className={styles.formHeader}>
            <h2 className={styles.title}>Sign in to your account</h2>
          </div>

          <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={handleSubmit}>
              {isError && (
                <div className={styles.errorAlert} role="alert">
                  <span className={styles.errorBold}>Login failed!</span> Please
                  check your credentials and try again.
                </div>
              )}

              {errorMessage && (
                <div className={styles.errorAlert} role="alert">
                  <span className={styles.errorBold}>Error:</span>{" "}
                  {errorMessage}
                </div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="username" className={styles.label}>
                  Username or Email
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={userNameOrEmailAddress}
                    onChange={(e) => setUserNameOrEmailAddress(e.target.value)}
                    className={styles.input}
                    disabled={isPending}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.labelFlex}>
                  <label htmlFor="password" className={styles.label}>
                    Password
                  </label>
                  <div className={styles.forgotPassword}>
                    <Link href="/forgot-password" className={styles.forgotLink}>
                      Forgot password?
                    </Link>
                  </div>
                </div>
                <div className={styles.passwordWrapper}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    disabled={isPending}
                  >
                    {showPassword ? (
                      <EyeOff className={styles.eyeIcon} />
                    ) : (
                      <Eye className={styles.eyeIcon} />
                    )}
                  </button>
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
                      <LogIn size={18} />
                      Sign in
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className={styles.registerPrompt}>
              Not a member?{" "}
              <Link href={"/Auth/SignUp"} className={styles.registerLink}>
                Register now
              </Link>
            </p>
          </div>
        </div>

        <div className={styles.imageSide}>
          <div className={styles.imageOverlay}>
            <h2 className={styles.imageTitle}>Experience Amazing Events</h2>
            <p className={styles.imageText}>
              Join our community and discover the best events near you
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeeLoginForm;
