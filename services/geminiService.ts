
import { GoogleGenAI, Type } from "@google/genai";
import { ISOConfig, GeneratedFile } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateISOBlueprint = async (config: ISOConfig): Promise<GeneratedFile[]> => {
  const ai = getAI();
  const prompt = `Generate a complete set of configuration files for a bootable ${config.os} ISO.
  Target Architecture: ${config.architecture}
  Hostname: ${config.hostname}
  User: ${config.username}
  Included Packages: ${config.packages.join(', ')}
  Cloud-Init: ${config.isCloudInitEnabled ? 'Enabled' : 'Disabled'}
  Custom Instructions: ${config.customScripts}

  Provide a professional set of files including:
  1. A README.md with detailed instructions on how to use xorriso/mkisofs to build this.
  2. The main installation configuration (e.g., user-data for Ubuntu/Cloud-init, preseed.cfg for Debian, or answers.yaml for Alpine).
  3. A shell script (build.sh) that automates the image creation process.
  4. A secondary config file (e.g., grub.cfg or isolinux.cfg).

  Ensure the output is a valid JSON array of objects with 'name', 'content', and 'language' fields.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            content: { type: Type.STRING },
            language: { type: Type.STRING }
          },
          required: ["name", "content", "language"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return [];
  }
};

export const getAIAssistance = async (query: string, currentConfig: ISOConfig): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The user is configuring a bootable ISO for ${currentConfig.os}. Question: ${query}`,
    config: {
      systemInstruction: "You are an expert Linux System Administrator specializing in custom bootable images and automated deployments."
    }
  });
  return response.text || "Sorry, I couldn't process that request.";
};
