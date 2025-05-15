// API service implementation
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyBOXYXS6ErNCVmu6J0GReIz-F1Hbid-9dk";
const genAI = new GoogleGenerativeAI(apiKey || "");

export const getImageData = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const base64Data = dataUrl.split(",")[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeMathImage = async (imageFile: File): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const imageData = await getImageData(imageFile);

    const imagePart = {
      inlineData: {
        data: imageData,
        mimeType: imageFile.type,
      },
    };
    const promptText = `
  Validate the following ticket step by step, showing all necessary checks.

  Validation criteria:
  - Check if the ticket includes a valid QR code
  - Check if the ticket has a valid date (not expired and in correct format)
  - Check if the ticket is associated with a valid event

    

  Format the validation process for easy readability. Do not use asterisks or markdown formatting like ** for emphasis.
`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: promptText }, imagePart],
        },
      ],
    });

    return result.response.text();
  } catch (error: unknown) {
    console.error("Error analyzing image:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to analyze image: ${errorMessage}`);
  }
};
