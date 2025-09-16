

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

  // Coerce to number to handle cases where data might be stored as string
  const numWeight = Number(weight);
  const numHeight = Number(height);
  const numAge = Number(age);

  if (isNaN(numWeight) || isNaN(numHeight) || isNaN(numAge)) {
    return 0; // Return 0 if data is invalid to prevent NaN
  }

  // Using Mifflin-St Jeor Equation for BMR
  let bmr: number;
  if (gender === Gender.MALE) {
    bmr = 10 * numWeight + 6.25 * numHeight - 5 * numAge + 5;
  } else {
    bmr = 10 * numWeight + 6.25 * numHeight - 5 * numAge - 161;
  }

  const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel];

  return Math.round(tdee);
};
