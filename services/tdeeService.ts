
import { UserProfile, Gender, ActivityLevel } from '../types';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  [ActivityLevel.SEDENTARY]: 1.2,
  [ActivityLevel.LIGHTLY_ACTIVE]: 1.375,
  [ActivityLevel.MODERATELY_ACTIVE]: 1.55,
  [ActivityLevel.VERY_ACTIVE]: 1.725,
  [ActivityLevel.EXTRA_ACTIVE]: 1.9,
};

export const calculateTDEE = (profile: UserProfile): number => {
  const { weight, height, age, gender, activityLevel } = profile;

  // Using Mifflin-St Jeor Equation for BMR
  let bmr: number;
  if (gender === Gender.MALE) {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel];

  return Math.round(tdee);
};
