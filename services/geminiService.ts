
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, FitnessPlan } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const planSchema = {
    type: Type.OBJECT,
    properties: {
        workoutPlan: {
            type: Type.OBJECT,
            properties: {
                weeklySchedule: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            day: { type: Type.STRING },
                            focus: { type: Type.STRING },
                            exercises: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING },
                                        sets: { type: Type.INTEGER },
                                        reps: { type: Type.STRING },
                                        rest: { type: Type.STRING }
                                    },
                                    required: ["name", "sets", "reps", "rest"]
                                }
                            }
                        },
                        required: ["day", "focus", "exercises"]
                    }
                }
            },
            required: ["weeklySchedule"]
        },
        nutritionPlan: {
            type: Type.OBJECT,
            properties: {
                dailyCalories: { type: Type.INTEGER },
                proteinGrams: { type: Type.INTEGER },
                carbsGrams: { type: Type.INTEGER },
                fatGrams: { type: Type.INTEGER },
                sampleMeals: {
                    type: Type.OBJECT,
                    properties: {
                        breakfast: { type: Type.STRING },
                        lunch: { type: Type.STRING },
                        dinner: { type: Type.STRING },
                        snack: { type: Type.STRING }
                    },
                    required: ["breakfast", "lunch", "dinner", "snack"]
                }
            },
            required: ["dailyCalories", "proteinGrams", "carbsGrams", "fatGrams", "sampleMeals"]
        }
    },
    required: ["workoutPlan", "nutritionPlan"]
};


const generatePrompt = (profile: UserProfile): string => {
  return `
    You are a world-class fitness and nutrition expert AI. Your task is to create a personalized weekly workout and nutrition plan for a user based on their profile.

    User Profile:
    - Age: ${profile.age}
    - Gender: ${profile.gender}
    - Weight: ${profile.weight} kg
    - Height: ${profile.height} cm
    - Activity Level: "${profile.activityLevel}"
    - Main Goal: ${profile.goal.type}
    - Specific Goal Details: "${profile.goal.details}"
    - Available Equipment: "${profile.goal.equipment}"

    Based on this profile, generate a comprehensive plan in JSON format. The JSON must adhere to the provided schema.

    The workout plan should be a 7-day schedule. If a day is a rest day, the 'focus' should be 'Rest Day' and the 'exercises' array should be empty. For workout days, provide 4-6 exercises targeting different muscle groups according to a logical split (e.g., Push/Pull/Legs, Upper/Lower, Full Body).

    The nutrition plan should provide a daily calorie target and macro breakdown (protein, carbs, fat in grams) appropriate for the user's goal. Also, provide example meals for breakfast, lunch, dinner, and one snack for a single representative day. The meal examples should be healthy, balanced, and align with the user's goals.

    Important: Do not include any introductory text, closing remarks, or any content outside of the single, valid JSON object that matches the schema.
  `;
};

export const generateFitnessPlan = async (profile: UserProfile): Promise<FitnessPlan> => {
  try {
    const prompt = generatePrompt(profile);
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: planSchema,
        },
    });

    const jsonText = response.text.trim();
    const plan = JSON.parse(jsonText);
    return plan as FitnessPlan;
  } catch (error) {
    console.error("Error generating fitness plan:", error);
    throw new Error("Failed to generate a fitness plan from the AI. Please try again.");
  }
};
