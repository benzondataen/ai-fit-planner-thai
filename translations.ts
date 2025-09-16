import { useState, useEffect } from 'react';

const th = {
    "appName": "FitAI Planner",
    "logout": "ออกจากระบบ",
    "resetPlan": "สร้างแผนใหม่",
    "loginWithGoogle": "เข้าสู่ระบบด้วย Google",
    "welcomeMessage": "ยินดีต้อนรับสู่ FitAI Planner",
    "welcomeSubtitle": "โค้ชฟิตเนสและโภชนาการ AI ส่วนตัวของคุณ",
    "profileFormTitle": "บอกเราเกี่ยวกับตัวคุณเพื่อรับแผนฟิตเนสส่วนตัว",
    "weight": "น้ำหนัก (กก.)",
    "height": "ส่วนสูง (ซม.)",
    "age": "อายุ",
    "gender": "เพศ",
    "activityLevel": "ระดับกิจกรรมในแต่ละวัน",
    "fitnessGoalTitle": "เป้าหมายการออกกำลังกายของคุณ",
    "primaryGoal": "เป้าหมายหลัก",
    "goalDetails": "อธิบายเป้าหมายของคุณโดยละเอียด",
    "goalDetailsPlaceholder": "เช่น 'ลด 10 กก. ใน 3 เดือน' หรือ 'สร้างกล้ามเนื้อ'",
    "equipment": "อุปกรณ์ที่มี",
    "equipmentPlaceholder": "เช่น 'ยิมเต็มรูปแบบ', 'ดัมเบลและยางยืด'",
    "defaultEquipment": "เข้ายิมได้เต็มที่",
    "workoutDays": "วันที่ต้องการออกกำลังกาย (เลือกอย่างน้อย 1 วัน)",
    "createPlan": "สร้างแผนของฉัน",
    "loadingProfile": "กำลังโหลดโปรไฟล์...",
    "generatingPlan": "กำลังสร้างแผนของคุณ...",
    "aiIsCrafting": "AI กำลังสร้างสรรค์แผนส่วนตัวของคุณ...",
    "failedToGenerate": "สร้างแผนไม่สำเร็จ",
    "tryAgain": "ลองอีกครั้ง",
    "dashboardTitle": "แดชบอร์ดของคุณ",
    "dashboardSubtitle": "นี่คือเส้นทางฟิตเนสที่ AI สร้างขึ้นเพื่อคุณโดยเฉพาะ",
    "currentWeight": "น้ำหนักปัจจุบัน",
    "goal": "เป้าหมาย",
    "maintenance": "แคลอรี่ที่ต้องการ",
    "kcalDay": "แคลอรี่/วัน",
    "workoutPlanTitle": "แผนการออกกำลังกายรายสัปดาห์",
    "today": "วันนี้",
    "exercise": "ท่าออกกำลังกาย",
    "sets": "เซ็ต",
    "reps": "ครั้ง",
    "rest": "พัก",
    "restDayMessage": "วันนี้เป็นวันพักผ่อน ฟื้นฟูร่างกายให้แข็งแรง!",
    "nutritionGuideTitle": "คู่มือโภชนาการประจำวันของคุณ",
    "calories": "แคลอรี่",
    "protein": "โปรตีน",
    "carbs": "คาร์โบไฮเดรต",
    "fat": "ไขมัน",
    "kcal": "kcal",
    "protein_short": "ป",
    "carbs_short": "ค",
    "fat_short": "ข",
    "sampleMeals": "ตัวอย่างเมนูอาหาร",
    "fillAllFields": "กรุณากรอกข้อมูลให้ครบทุกช่อง",
    "loginFailed": "เข้าสู่ระบบด้วย Google ไม่สำเร็จ กรุณาลองอีกครั้ง",
    "failedToLoadProfile": "ไม่สามารถโหลดโปรไฟล์ของคุณได้",
    "loginRequired": "คุณต้องเข้าสู่ระบบเพื่อสร้างแผน",
    "unknownError": "เกิดข้อผิดพลาดที่ไม่รู้จัก",
    "saveError": "ไม่สามารถบันทึกโปรไฟล์และแผนของคุณได้",
    "fetchError": "ไม่สามารถดึงข้อมูลโปรไฟล์ของคุณได้",
    "generatePlanError": "ไม่สามารถสร้างแผนฟิตเนสจาก AI ได้ กรุณาลองอีกครั้ง",
    "breakfast": "อาหารเช้า",
    "lunch": "อาหารกลางวัน",
    "dinner": "อาหารเย็น",
    "snack": "ของว่าง",
    "sendFeedback": "ส่งข้อเสนอแนะ",
    "feedbackModalTitle": "แบ่งปันความคิดเห็นของคุณ",
    "feedbackPlaceholder": "บอกเราว่าคุณคิดอย่างไรเกี่ยวกับแอปพลิเคชันนี้...",
    "submitFeedback": "ส่งความคิดเห็น",
    "cancel": "ยกเลิก",
    "feedbackSuccess": "ขอบคุณสำหรับข้อเสนอแนะ!",
    "feedbackError": "ไม่สามารถส่งข้อเสนอแนะได้ กรุณาลองอีกครั้ง",
    "submitting": "กำลังส่ง...",
    "gender_male": "ชาย",
    "gender_female": "หญิง",
    "activity_sedentary": "นั่งทำงานเป็นส่วนใหญ่",
    "activity_lightly_active": "ออกกำลังกายเบาๆ (1-3 วัน/สัปดาห์)",
    "activity_moderately_active": "ออกกำลังกายปานกลาง (3-5 วัน/สัปดาห์)",
    "activity_very_active": "ออกกำลังกายหนัก (6-7 วัน/สัปดาห์)",
    "activity_extra_active": "ออกกำลังกายหนักมาก (ทุกวัน/ทำงานใช้แรง)",
    "goal_lose_weight": "ลดน้ำหนัก",
    "goal_gain_muscle": "สร้างกล้ามเนื้อ",
    "goal_maintain_health": "รักษาสุขภาพ",
    "gemini_language_instruction": "เนื้อหาทั้งหมดในแผน, รวมถึงชื่อท่าออกกำลังกาย, กลุ่มกล้ามเนื้อที่โฟกัส (focus), ตัวอย่างเมนูอาหาร และ ชื่อวัตถุดิบทั้งหมดในเมนูอาหาร ต้องเป็นภาษาไทยทั้งหมด",
    "gemini_full_prompt": "คุณคือ AI ผู้เชี่ยวชาญด้านฟิตเนสและโภชนาการระดับโลก งานของคุณคือการสร้างแผนการออกกำลังกายและโภชนาการรายสัปดาห์ส่วนบุคคลสำหรับผู้ใช้ตามโปรไฟล์ของพวกเขา\n\nโปรไฟล์ผู้ใช้:\n- อายุ: {{age}} ปี\n- เพศ: {{gender}}\n- น้ำหนัก: {{weight}} กก.\n- ส่วนสูง: {{height}} ซม.\n- ระดับกิจกรรม: \"{{activityLevel}}\"\n- วันที่ต้องการออกกำลังกาย: {{workoutDays}}\n- เป้าหมายหลัก: {{goalType}}\n- รายละเอียดเป้าหมายเฉพาะ: \"{{goalDetails}}\"\n- อุปกรณ์ที่มี: \"{{equipment}}\"\n\nจากโปรไฟล์นี้ โปรดสร้างแผนที่ครอบคลุมในรูปแบบ JSON โดย JSON ต้องเป็นไปตามสคีมาที่ให้ไว้\n\nข้อกำหนดเพิ่มเติม:\n- ภาษา: {{languageInstruction}}\n- แผนการออกกำลังกาย: ต้องเป็นตาราง 7 วัน โปรดจัดตารางการออกกำลังกายเฉพาะในวันที่ผู้ใช้เลือกเท่านั้น ({{workoutDays}}). วันอื่นๆ ทั้งหมดในสัปดาห์จะต้องเป็น 'วันพัก' และมีอาร์เรย์ 'exercises' ที่ว่างเปล่า สำหรับวันออกกำลังกาย ให้จัดหาท่าออกกำลังกาย 4-6 ท่าที่เน้นกลุ่มกล้ามเนื้อต่างๆ ตามการแบ่งที่สมเหตุสมผล (เช่น Push/Pull/Legs, Upper/Lower, Full Body)\n- แผนโภชนาการ: ควรระบุเป้าหมายแคลอรี่รายวันและการแบ่งสารอาหารหลัก (โปรตีน, คาร์โบไฮเดรต, ไขมัน เป็นกรัม) ที่เหมาะสมกับเป้าหมายของผู้ใช้ นอกจากนี้ ให้ยกตัวอย่างอาหารสำหรับอาหารเช้า กลางวัน เย็น และของว่างหนึ่งมื้อสำหรับหนึ่งวัน ตัวอย่างอาหารควรดีต่อสุขภาพ สมดุล และสอดคล้องกับเป้าหมายของผู้ใช้\n\nสำคัญ: ห้ามใส่ข้อความเกริ่นนำ ข้อความปิดท้าย หรือเนื้อหาใดๆ นอกเหนือจากอ็อบเจกต์ JSON ที่ถูกต้องและตรงกับสคีมาเพียงอ็อบเจกต์เดียว"
};

const en = {
    "appName": "FitAI Planner",
    "logout": "Logout",
    "resetPlan": "New Plan",
    "loginWithGoogle": "Login with Google",
    "welcomeMessage": "Welcome to FitAI Planner",
    "welcomeSubtitle": "Your personal AI fitness and nutrition coach",
    "profileFormTitle": "Tell us about yourself to get a personalized fitness plan",
    "weight": "Weight (kg)",
    "height": "Height (cm)",
    "age": "Age",
    "gender": "Gender",
    "activityLevel": "Daily Activity Level",
    "fitnessGoalTitle": "Your Fitness Goal",
    "primaryGoal": "Primary Goal",
    "goalDetails": "Describe your goal in detail",
    "goalDetailsPlaceholder": "e.g., 'Lose 10kg in 3 months' or 'Build muscle for summer'",
    "equipment": "Available Equipment",
    "equipmentPlaceholder": "e.g., 'Full gym access', 'Dumbbells and resistance bands'",
    "defaultEquipment": "Full gym access",
    "workoutDays": "Workout Days (select at least 1)",
    "createPlan": "Create My Plan",
    "loadingProfile": "Loading profile...",
    "generatingPlan": "Generating your plan...",
    "aiIsCrafting": "AI is crafting your personalized plan...",
    "failedToGenerate": "Failed to generate plan",
    "tryAgain": "Try Again",
    "dashboardTitle": "Your Dashboard",
    "dashboardSubtitle": "Here is your AI-generated fitness journey",
    "currentWeight": "Current Weight",
    "goal": "Goal",
    "maintenance": "Maintenance Calories",
    "kcalDay": "kcal/day",
    "workoutPlanTitle": "Weekly Workout Plan",
    "today": "Today",
    "exercise": "Exercise",
    "sets": "Sets",
    "reps": "Reps",
    "rest": "Rest",
    "restDayMessage": "Today is a rest day. Recover and get stronger!",
    "nutritionGuideTitle": "Your Daily Nutrition Guide",
    "calories": "Calories",
    "protein": "Protein",
    "carbs": "Carbs",
    "fat": "Fat",
    "kcal": "kcal",
    "protein_short": "P",
    "carbs_short": "C",
    "fat_short": "F",
    "sampleMeals": "Sample Meal Plan",
    "fillAllFields": "Please fill in all fields",
    "loginFailed": "Login with Google failed. Please try again.",
    "failedToLoadProfile": "Could not load your profile.",
    "loginRequired": "You must be logged in to create a plan.",
    "unknownError": "An unknown error occurred.",
    "saveError": "Could not save your profile and plan.",
    "fetchError": "Could not fetch your profile data.",
    "generatePlanError": "Could not generate a fitness plan from AI. Please try again.",
    "breakfast": "Breakfast",
    "lunch": "Lunch",
    "dinner": "Dinner",
    "snack": "Snack",
    "sendFeedback": "Send Feedback",
    "feedbackModalTitle": "Share Your Feedback",
    "feedbackPlaceholder": "Tell us what you think about this application...",
    "submitFeedback": "Submit Feedback",
    "cancel": "Cancel",
    "feedbackSuccess": "Thank you for your feedback!",
    "feedbackError": "Could not send feedback. Please try again.",
    "submitting": "Submitting...",
    "gender_male": "Male",
    "gender_female": "Female",
    "activity_sedentary": "Sedentary (office job)",
    "activity_lightly_active": "Lightly Active (1-3 days/week)",
    "activity_moderately_active": "Moderately Active (3-5 days/week)",
    "activity_very_active": "Very Active (6-7 days/week)",
    "activity_extra_active": "Extra Active (daily workout/physical job)",
    "goal_lose_weight": "Lose Weight",
    "goal_gain_muscle": "Gain Muscle",
    "goal_maintain_health": "Maintain Health",
    "gemini_language_instruction": "All content in the plan, including exercise names, focus areas, sample meals, and all ingredient names in the meals, must be in English.",
    "gemini_full_prompt": "You are a world-class AI fitness and nutrition expert. Your task is to create a personalized weekly workout and nutrition plan for a user based on their profile.\n\nUser Profile:\n- Age: {{age}} years\n- Gender: {{gender}}\n- Weight: {{weight}} kg\n- Height: {{height}} cm\n- Activity Level: \"{{activityLevel}}\"\n- Desired workout days: {{workoutDays}}\n- Primary Goal: {{goalType}}\n- Specific Goal Details: \"{{goalDetails}}\"\n- Available Equipment: \"{{equipment}}\"\n\nFrom this profile, please generate a comprehensive plan in JSON format. The JSON must strictly adhere to the provided schema.\n\nAdditional Requirements:\n- Language: {{languageInstruction}}\n- Workout Plan: This must be a 7-day schedule. Please schedule workouts only on the user's chosen days ({{workoutDays}}). All other days of the week must be designated as a 'Rest Day' with an empty 'exercises' array. For workout days, provide 4-6 exercises targeting different muscle groups according to a logical split (e.g., Push/Pull/Legs, Upper/Lower, Full Body).\n- Nutrition Plan: Specify a daily calorie target and macronutrient split (protein, carbs, fat in grams) appropriate for the user's goal. Also, provide one full day of sample meals for breakfast, lunch, dinner, and one snack. The sample meals should be healthy, balanced, and align with the user's goals.\n\nImportant: Do not include any introductory text, concluding remarks, or any content whatsoever outside of the single, valid, schema-compliant JSON object."
};

type Translations = typeof th;

const translations: { [key: string]: Translations } = { th, en };

let currentLanguage: 'th' | 'en' = (localStorage.getItem('language') as 'th' | 'en') || 'th';

const listeners: Array<() => void> = [];

export const setLanguage = (lang: 'th' | 'en') => {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  listeners.forEach(listener => listener());
};

export const getLanguage = () => currentLanguage;

export const t = (key: keyof Translations, replacements?: { [key: string]: string | number }): string => {
  let translation = translations[currentLanguage][key] || key;
  if (replacements) {
    Object.keys(replacements).forEach(rKey => {
      translation = translation.replace(new RegExp(`{{${rKey}}}`, 'g'), String(replacements[rKey]));
    });
  }
  return translation;
};

const subscribe = (callback: () => void) => {
  listeners.push(callback);
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};

export const useTranslation = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setTick(tick => tick + 1);
    });
    return unsubscribe;
  }, []);

  return {
    t,
    setLanguage,
    language: getLanguage(),
  };
};
