"use client";
import { analyzeMathImage } from "@/app/lib/api/gemini";
import { useState } from "react";
import styles from "./Style/MathSolver.module.css";

export default function MathSolverComponent() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [contextPrompt, setContextPrompt] = useState("");
  const [solution, setSolution] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      setImageFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Clear previous results and errors
      setSolution("");
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      setError("Please upload the ticket for verification.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await analyzeMathImage(imageFile);
      setSolution(result);
    } catch (err) {
      setError(
        `Error: ${
          err instanceof Error ? err.message : "Failed to analyze the image"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImageFile(null);
    setContextPrompt("");
    setSolution("");
    setImagePreview("");
    setError("");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ticket Verification</h1>

      <div className={styles.formSection}>
        {/* Image Upload */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Upload a Ticket</label>
          <div className={styles.uploadContainer}>
            <label className={styles.uploadArea}>
              <div className={styles.uploadContent}>
                <svg
                  className={styles.uploadIcon}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className={styles.uploadText}>
                  {imageFile
                    ? imageFile.name
                    : "Click to upload or drag and drop"}
                </p>
              </div>
              <input
                type="file"
                className={styles.fileInput}
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className={styles.inputGroup}>
            <p className={styles.label}>Preview:</p>
            <div className={styles.previewContainer}>
              <img
                src={imagePreview}
                alt="Math problem"
                className={styles.previewImage}
              />
            </div>
          </div>
        )}

        {/* Context Input */}
        <div className={styles.inputGroup}>
          <label htmlFor="context" className={styles.label}>
            Additional Context (optional)
          </label>
          <textarea
            id="context"
            className={styles.textArea}
            // placeholder="E.g., 'This is a calculus problem about derivatives' or 'I need help with this algebraic equation'"
            value={contextPrompt}
            onChange={(e) => setContextPrompt(e.target.value)}
            rows={3}
          />
        </div>

        {/* Buttons */}
        <div className={styles.buttonGroup}>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !imageFile}
            className={`${styles.button} ${styles.primaryButton} ${
              isLoading || !imageFile ? styles.disabledButton : ""
            }`}
          >
            {isLoading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                Analyzing...
              </div>
            ) : (
              "Verify Ticket"
            )}
          </button>

          <button
            onClick={handleReset}
            className={`${styles.button} ${styles.secondaryButton}`}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* Solution Output */}
      {solution && (
        <div className={styles.solutionContainer}>
          <h2 className={styles.solutionTitle}>Solution:</h2>
          <div className={styles.solutionContent}>
            {solution.split("\n").map((line, index) => (
              <div key={index} className={styles.solutionLine}>
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
