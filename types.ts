export enum Gender {
  MALE = 'ชาย',
  FEMALE = 'หญิง',
}

export enum ActivityLevel {
  SEDENTARY = 'นั่งทำงานเป็นส่วนใหญ่ (ไม่ออกกำลังกายเลย)',
  LIGHTLY_ACTIVE = 'ออกกำลังกายเบาๆ (1-3 วัน/สัปดาห์)',
  MODERATELY_ACTIVE = 'ออกกำลังกายปานกลาง (3-5 วัน/สัปดาห์)',
  VERY_ACTIVE = 'ออกกำลังกายหนัก (6-7 วัน/สัปดาห์)',
  EXTRA_ACTIVE = 'ออกกำลังกายหนักมาก (ทุกวัน และทำงานที่ใช้แรงเยอะ)',
}

export enum GoalType {
  LOSE_WEIGHT = 'ลดน้ำหนัก',
  GAIN_MUSCLE = 'สร้างกล้ามเนื้อ',
  MAINTAIN_HEALTH = 'รักษาสุขภาพ',
}

export interface UserProfile {
  weight: number;
  height: number;
  age: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  workoutDays: string[]; // e.g., ['จันทร์', 'พุธ', 'ศุกร์']
  goal: {
    type: GoalType;
    details: string; // e.g., "Lose 5kg in 2 months"
    equipment: string; // e.g., "Dumbbells only", "Full gym access"
  };
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

export interface DailyWorkout {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  weeklySchedule: DailyWorkout[];
}

export interface NutritionPlan {
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  sampleMeals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snack: string;
  };
}

export interface FitnessPlan {
    workoutPlan: WorkoutPlan;
    nutritionPlan: NutritionPlan;
}

export interface UserData {
    profile: UserProfile;
    plan: FitnessPlan;
}