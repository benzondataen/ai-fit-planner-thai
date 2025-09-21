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
    "randomizeMeals": "สุ่มเมนูใหม่",
    "randomizing": "กำลังสุ่ม...",
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
    "gemini_full_prompt": "คุณคือ AI ผู้เชี่ยวชาญด้านฟิตเนสและโภชนาการระดับโลก งานของคุณคือการสร้างแผนการออกกำลังกายและโภชนาการรายสัปดาห์ส่วนบุคคลสำหรับผู้ใช้ตามโปรไฟล์ของพวกเขา\n\nโปรไฟล์ผู้ใช้:\n- อายุ: {{age}} ปี\n- เพศ: {{gender}}\n- น้ำหนัก: {{weight}} กก.\n- ส่วนสูง: {{height}} ซม.\n- ระดับกิจกรรม: \"{{activityLevel}}\"\n- วันที่ต้องการออกกำลังกาย: {{workoutDays}}\n- เป้าหมายหลัก: {{goalType}}\n- รายละเอียดเป้าหมายเฉพาะ: \"{{goalDetails}}\"\n- อุปกรณ์ที่มี: \"{{equipment}}\"\n\nจากโปรไฟล์นี้ โปรดสร้างแผนที่ครอบคลุมในรูปแบบ JSON โดย JSON ต้องเป็นไปตามสคีมาที่ให้ไว้\n\nข้อกำหนดเพิ่มเติม:\n- ภาษา: {{languageInstruction}}\n- แผนการออกกำลังกาย: ต้องเป็นตาราง 7 วัน โปรดจัดตารางการออกกำลังกายเฉพาะในวันที่ผู้ใช้เลือกเท่านั้น ({{workoutDays}}). วันอื่นๆ ทั้งหมดในสัปดาห์จะต้องเป็น 'วันพัก' และมีอาร์เรย์ 'exercises' ที่ว่างเปล่า สำหรับวันออกกำลังกาย ให้จัดหาท่าออกกำลังกาย 4-6 ท่าที่เน้นกลุ่มกล้ามเนื้อต่างๆ ตามการแบ่งที่สมเหตุสมผล (เช่น Push/Pull/Legs, Upper/Lower, Full Body)\n- แผนโภชนาการ: ควรระบุเป้าหมายแคลอรี่รายวันและการแบ่งสารอาหารหลัก (โปรตีน, คาร์โบไฮเดรต, ไขมัน เป็นกรัม) ที่เหมาะสมกับเป้าหมายของผู้ใช้ นอกจากนี้ ให้ยกตัวอย่างอาหารสำหรับอาหารเช้า กลางวัน เย็น และของว่างหนึ่งมื้อสำหรับหนึ่งวัน ตัวอย่างอาหารควรดีต่อสุขภาพ สมดุล และสอดคล้องกับเป้าหมายของผู้ใช้\n\nสำคัญ: ห้ามใส่ข้อความเกริ่นนำ ข้อความปิดท้าย หรือเนื้อหาใดๆ นอกเหนือจากอ็อบเจกต์ JSON ที่ถูกต้องและตรงกับสคีมาเพียงอ็อบเจกต์เดียว",    
    "foodTracker": {
        "title": "ติดตามอาหาร",
        "addMeal": "เพิ่มมื้ออาหารใหม่",
        "mealName": "ชื่อมื้ออาหาร",
        "mealNamePlaceholder": "เช่น อาหารเช้า, กลางวัน, เย็น, ของว่าง",
        "enterManually": "ป้อนข้อมูลเอง",
        "uploadPhoto": "อัปโหลดรูปภาพ",
        "selectedFile": "ไฟล์ที่เลือก",
        "analyzeMeal": "วิเคราะห์มื้ออาหาร",
        "analysisResults": "ผลการวิเคราะห์",
        "calories": "แคลอรี่",
        "nutrients": "สารอาหาร",
        "saveMeal": "บันทึกมื้ออาหาร",
        "savedSuccessfully": "บันทึกมื้ออาหารเรียบร้อยแล้ว!",
        "noInputError": "กรุณาป้อนชื่อมื้ออาหารหรืออัปโหลดรูปภาพเพื่อวิเคราะห์",
        "analysisError": "ไม่สามารถวิเคราะห์รายการอาหารได้ กรุณาลองอีกครั้ง",
        "analyzing": "กำลังวิเคราะห์...",
        "analyzingMessage": "AI กำลังวิเคราะห์รายการอาหารของคุณ...",
        "description": "คำอธิบาย",
        "noAnalysisResult": "ไม่มีผลการวิเคราะห์ให้บันทึก กรุณาวิเคราะห์มื้ออาหารก่อน",
        "unnamedMeal": "มื้ออาหารที่ไม่มีชื่อ",
        "saveMealError": "ไม่สามารถบันทึกมื้ออาหารได้ กรุณาลองอีกครั้ง",
        "fetchMealsError": "ไม่สามารถดึงรายการอาหารประจำวันได้ กรุณาลองอีกครั้ง",
        "dailySummary": "สรุปมื้ออาหารประจำวัน",
        "totalCalories": "แคลอรี่รวม",
        "noMealsRecorded": "ไม่มีมื้ออาหารบันทึกไว้สำหรับวันนี้",
        "mealType": {
            "breakfast": "อาหารเช้า",
            "lunch": "อาหารกลางวัน",
            "dinner": "อาหารเย็น",
            "snack": "ของว่าง",
            "other": "อื่นๆ"
        },
        "dailyTargets": "เป้าหมายรายวัน",
        "targetCalories": "เป้าหมายแคลอรี่",
        "targetProtein": "เป้าหมายโปรตีน",
        "targetCarbs": "เป้าหมายคาร์โบไฮเดรต",
        "targetFat": "เป้าหมายไขมัน",
        "progress": "ความคืบหน้า",
        "caloriesProgress": "ความคืบหน้าแคลอรี่",
        "proteinProgress": "ความคืบหน้าโปรตีน",
        "carbsProgress": "ความคืบหน้าคาร์โบไฮเดรต",
        "fatProgress": "ความคืบหน้าไขมัน"
    }
  };

const en = {
    "appName": "AI Fit Planner",
    "loadingProfile": "Loading user profile...",
    "generatingPlan": "Generating your personalized plan...",
    "failedToLoadProfile": "Failed to load user profile. Please try again.",
    "loginRequired": "Login required to perform this action.",
    "unknownError": "An unknown error occurred. Please try again.",
    "failedToGenerate": "Failed to generate plan",
    "tryAgain": "Try Again",
    "logout": "Logout",
    "resetPlan": "Reset Plan",
    "dashboard": "Dashboard",
    "foodTracker": {
        "title": "Food Tracker",
        "addMeal": "Add New Meal",
        "mealName": "Meal Name",
        "mealNamePlaceholder": "e.g., Breakfast, Lunch, Dinner, Snack",
        "enterManually": "Enter Manually",
        "uploadPhoto": "Upload Photo",
        "selectedFile": "Selected File",
        "analyzeMeal": "Analyze Meal",
        "analysisResults": "Analysis Results",
        "calories": "Calories",
        "nutrients": "Nutrients",
        "saveMeal": "Save Meal",
        "savedSuccessfully": "Meal saved successfully!",
        "noInputError": "Please enter a meal name or upload a photo to analyze.",
        "analysisError": "Failed to analyze food item. Please try again.",
        "analyzing": "Analyzing...",
        "analyzingMessage": "AI is analyzing your food item...",
        "description": "Description",
        "noAnalysisResult": "No analysis result to save. Please analyze a meal first.",
        "unnamedMeal": "Unnamed Meal",
        "saveMealError": "Failed to save meal. Please try again.",
        "fetchMealsError": "Failed to fetch daily meals. Please try again.",
        "dailySummary": "Daily Meal Summary",
        "totalCalories": "Total Calories",
        "noMealsRecorded": "No meals recorded for this day.",
        "mealType": {
            "breakfast": "Breakfast",
            "lunch": "Lunch",
            "dinner": "Dinner",
            "snack": "Snack",
            "other": "Other"
        },
        "dailyTargets": "Daily Targets",
        "targetCalories": "Target Calories",
        "targetProtein": "Target Protein",
        "targetCarbs": "Target Carbs",
        "targetFat": "Target Fat",
        "progress": "Progress",
        "caloriesProgress": "Calories Progress",
        "proteinProgress": "Protein Progress",
        "carbsProgress": "Carbs Progress",
        "fatProgress": "Fat Progress"
    }
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

export const t = (key: string, replacements?: { [key: string]: string | number }): string => {
  let translation: string | { [key: string]: any } = translations[currentLanguage];
  const keyParts = key.split('.');

  for (let i = 0; i < keyParts.length; i++) {
    if (typeof translation === 'object' && translation !== null && keyParts[i] in translation) {
      translation = translation[keyParts[i]];
    } else {
      translation = key; // Fallback to key if not found
      break;
    }
  }

  if (typeof translation !== 'string') {
    return key; // Return key if the final resolved value is not a string
  }

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