export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

export enum ActivityLevel {
  SEDENTARY = 'Sedentary (little or no exercise)',
  LIGHTLY_ACTIVE = 'Lightly active (light exercise/sports 1-3 days/week)',
  MODERATELY_ACTIVE = 'Moderately active (moderate exercise/sports 3-5 days/week)',
  VERY_ACTIVE = 'Very active (hard exercise/sports 6-7 days a week)',
  EXTRA_ACTIVE = 'Extra active (very hard exercise/sports & physical job)',
}

export enum GoalType {
  LOSE_WEIGHT = 'Lose Weight',
  GAIN_MUSCLE = 'Gain Muscle',
  MAINTAIN_HEALTH = 'Maintain Health',
}

export interface UserProfile {
  weight: number;
  height: number;
  age: number;
  gender: Gender;
  activityLevel: ActivityLevel;
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