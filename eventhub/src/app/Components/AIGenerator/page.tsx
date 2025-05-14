"use client";
import { analyzeMathImage } from "@/app/lib/api/gemini";
import { useState } from "react";

export default function AIGeneratorPage() {
  const [result, setResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsLoading(true);
      try {
        // Replace with an appropriate context
        const analysis = await analyzeMathImage(e.target.files[0]);
        setResult(analysis);
      } catch (error) {
        console.error(error);
        setResult("Error analyzing image");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {isLoading && <p>Analyzing...</p>}
      {result && <div>{result}</div>}
    </div>
  );
}
