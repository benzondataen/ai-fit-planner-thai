import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, FitnessPlan } from '../types';
import { t } from '../translations';

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
    คุณคือ AI ผู้เชี่ยวชาญด้านฟิตเนสและโภชนาการระดับโลก งานของคุณคือการสร้างแผนการออกกำลังกายและโภชนาการรายสัปดาห์ส่วนบุคคลสำหรับผู้ใช้ตามโปรไฟล์ของพวกเขา

    โปรไฟล์ผู้ใช้:
    - อายุ: ${profile.age} ปี
    - เพศ: ${profile.gender}
    - น้ำหนัก: ${profile.weight} กก.
    - ส่วนสูง: ${profile.height} ซม.
    - ระดับกิจกรรม: "${profile.activityLevel}"
    - วันที่ต้องการออกกำลังกาย: ${profile.workoutDays.join(', ')}
    - เป้าหมายหลัก: ${profile.goal.type}
    - รายละเอียดเป้าหมายเฉพาะ: "${profile.goal.details}"
    - อุปกรณ์ที่มี: "${profile.goal.equipment}"

    จากโปรไฟล์นี้ โปรดสร้างแผนที่ครอบคลุมในรูปแบบ JSON โดย JSON ต้องเป็นไปตามสคีมาที่ให้ไว้

    ข้อกำหนดเพิ่มเติม:
    - ภาษา: เนื้อหาทั้งหมดในแผน, รวมถึงชื่อท่าออกกำลังกาย, กลุ่มกล้ามเนื้อที่โฟกัส (focus), ตัวอย่างเมนูอาหาร และ **ชื่อวัตถุดิบทั้งหมดในเมนูอาหาร** ต้องเป็นภาษาไทยทั้งหมด
    - แผนการออกกำลังกาย: ต้องเป็นตาราง 7 วัน โปรดจัดตารางการออกกำลังกายเฉพาะในวันที่ผู้ใช้เลือกเท่านั้น (${profile.workoutDays.join(', ')}). วันอื่นๆ ทั้งหมดในสัปดาห์จะต้องเป็น 'วันพัก' และมีอาร์เรย์ 'exercises' ที่ว่างเปล่า สำหรับวันออกกำลังกาย ให้จัดหาท่าออกกำลังกาย 4-6 ท่าที่เน้นกลุ่มกล้ามเนื้อต่างๆ ตามการแบ่งที่สมเหตุสมผล (เช่น Push/Pull/Legs, Upper/Lower, Full Body)

    แผนโภชนาการควรระบุเป้าหมายแคลอรี่รายวันและการแบ่งสารอาหารหลัก (โปรตีน, คาร์โบไฮเดรต, ไขมัน เป็นกรัม) ที่เหมาะสมกับเป้าหมายของผู้ใช้ นอกจากนี้ ให้ยกตัวอย่างอาหารสำหรับอาหารเช้า กลางวัน เย็น และของว่างหนึ่งมื้อสำหรับหนึ่งวัน ตัวอย่างอาหารควรดีต่อสุขภาพ สมดุล และสอดคล้องกับเป้าหมายของผู้ใช้

    สำคัญ: ห้ามใส่ข้อความเกริ่นนำ ข้อความปิดท้าย หรือเนื้อหาใดๆ นอกเหนือจากอ็อบเจกต์ JSON ที่ถูกต้องและตรงกับสคีมาเพียงอ็อบเจกต์เดียว
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
    throw new Error(t.generatePlanError);
  }
};