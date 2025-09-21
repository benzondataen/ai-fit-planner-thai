import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, FitnessPlan, SampleMeals, NutritionPlan } from '../types';
import { t, getLanguage } from '../translations';

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
  const lang = getLanguage();
  
  const languageInstruction = t('gemini_language_instruction');
  // FIX: Cast dynamic template literal to 'any' to satisfy TypeScript's strict key type for the translation function.
  const gender = t(`gender_${profile.gender.toLowerCase()}` as any);
  // FIX: Cast dynamic template literal to 'any' to satisfy TypeScript's strict key type for the translation function.
  const activityLevel = t(`activity_${profile.activityLevel.toLowerCase()}` as any);
  // FIX: Cast dynamic template literal to 'any' to satisfy TypeScript's strict key type for the translation function.
  const goalType = t(`goal_${profile.goal.type.toLowerCase()}` as any);
  
  return t('gemini_full_prompt', {
      age: profile.age,
      gender: gender,
      weight: profile.weight,
      height: profile.height,
      activityLevel: activityLevel,
      workoutDays: profile.workoutDays.join(', '),
      goalType: goalType,
      goalDetails: profile.goal.details,
      equipment: profile.goal.equipment,
      languageInstruction: languageInstruction,
  });
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
    throw new Error(t('generatePlanError'));
  }
};

const sampleMealsSchema = {
    type: Type.OBJECT,
    properties: {
        breakfast: { type: Type.STRING },
        lunch: { type: Type.STRING },
        dinner: { type: Type.STRING },
        snack: { type: Type.STRING }
    },
    required: ["breakfast", "lunch", "dinner", "snack"]
};

const generateNewMealsPrompt = (profile: UserProfile, nutritionPlan: NutritionPlan): string => {
  const languageInstruction = t('gemini_language_instruction');
  const goalType = t(`goal_${profile.goal.type.toLowerCase()}` as any);

  return `Based on the following user profile and nutritional targets, generate a new, creative, and different one-day sample meal plan (breakfast, lunch, dinner, snack). The meals should be healthy, balanced, and align with the user's goals.

User Profile:
- Goal: ${goalType}
- Specific Goal Details: "${profile.goal.details}"

Nutritional Targets:
- Daily Calories: ${nutritionPlan.dailyCalories} kcal
- Protein: ${nutritionPlan.proteinGrams}g
- Carbohydrates: ${nutritionPlan.carbsGrams}g
- Fat: ${nutritionPlan.fatGrams}g

Language: ${languageInstruction}

Important: Respond only with the JSON object for the meal plan, matching the provided schema. Do not include any other text.`;
};


const foodAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        calories: { type: Type.NUMBER },
        protein: { type: Type.NUMBER },
        carbs: { type: Type.NUMBER },
        fat: { type: Type.NUMBER },
        description: { type: Type.STRING }
    },
    required: ["calories", "protein", "carbs", "fat"]
};

export const analyzeFoodItem = async (input: string | File): Promise<{ calories: number; protein: number; carbs: number; fat: number; description?: string }> => {
    try {
        let contents: any[] = [];
        let modelName = "gemini-2.5-flash"; // Default model

        if (typeof input === 'string') {
            // Text input
            contents.push({ text: `Analyze the following food item and provide its estimated calories, protein, carbohydrates, and fat in grams. Respond ONLY with a JSON object matching the provided schema. Food item: ${input}` });
        } else {
            // Image input
            const reader = new FileReader();
            const base64 = await new Promise<string>((resolve, reject) => {
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
                reader.readAsDataURL(input);
            });

            // console.log("Raw base64 from FileReader:", base64);
            const mimeType = input.type;
            const data = base64.split(',')[1];

            // console.log("Extracted MIME type:", mimeType);
            // console.log("Extracted base64 data part:", data);

            if (!data || data.length === 0) {
                throw new Error("Image data could not be extracted or is empty.");
            }
            if (!mimeType || mimeType.length === 0) {
                throw new Error("Image MIME type could not be determined.");
            }

            contents.push(
                { text: "Analyze the food in this image and provide its estimated calories, protein, carbohydrates, and fat in grams. Also, provide a brief description of the food. Respond ONLY with a JSON object matching the provided schema." },
                { inlineData: { data: data, mimeType: mimeType } }
            );
            modelName = "gemini-2.5-flash";

            // console.log("Contents being sent to Gemini:", JSON.stringify(contents, null, 2));
            // console.log("Model name:", modelName);

        }

        const response = await ai.models.generateContent({
            model: modelName,
            contents: contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: foodAnalysisSchema,
            },
        });

        const jsonText = response.text.trim();
        const analysis = JSON.parse(jsonText);
        return analysis as { calories: number; protein: number; carbs: number; fat: number; description?: string };
    } catch (error) {
        console.error("Error analyzing food item:", error);
        throw new Error(t('foodTracker.analysisError') || 'Failed to analyze food item.');
    }
};

export const generateNewSampleMeals = async (profile: UserProfile, nutritionPlan: NutritionPlan): Promise<SampleMeals> => {
  try {
    const prompt = generateNewMealsPrompt(profile, nutritionPlan);
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: sampleMealsSchema,
        },
    });

    const jsonText = response.text.trim();
    const newMeals = JSON.parse(jsonText);
    return newMeals as SampleMeals;
  } catch (error) {
    console.error("Error generating new sample meals:", error);
    throw new Error(t('generatePlanError'));
  }
};
