export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum ActivityLevel {
  SEDENTARY = 'SEDENTARY',
  LIGHTLY_ACTIVE = 'LIGHTLY_ACTIVE',
  MODERATELY_ACTIVE = 'MODERATELY_ACTIVE',
  VERY_ACTIVE = 'VERY_ACTIVE',
  EXTRA_ACTIVE = 'EXTRA_ACTIVE',
}

export enum GoalType {
  LOSE_WEIGHT = 'LOSE_WEIGHT',
  GAIN_MUSCLE = 'GAIN_MUSCLE',
  MAINTAIN_HEALTH = 'MAINTAIN_HEALTH',
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