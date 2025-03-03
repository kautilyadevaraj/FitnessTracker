import * as z from "zod";

const OnboardingSchema = z.object({
  // Step 1: Basic Info
  age: z.number().min(1, "Please enter a valid age"),
  gender: z.string().optional(),

  // Step 2: Physical Metrics
  height: z.number().min(1, "Please enter your height in cm"),
  weight: z.number().min(1, "Please enter your weight in kg"),
  bodyFatPercentage: z.number().optional(),

  // Step 3: Health & Medical History
  medicalConditions: z.string().optional(),
  injuries: z.string().optional(),
  medications: z.string().optional(),

  // Step 4: Lifestyle & Habits
  occupation: z.string().optional(),
  dailyActivity: z.enum([
    "Sedentary",
    "Lightly Active",
    "Active",
    "Very Active",
  ]),
  sleepHours: z.number().min(1, "Sleep hours should be a valid number"),
  stressLevel: z.enum(["Low", "Moderate", "High"]),

  // Step 5: Fitness Background
  fitnessLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
  trainingFrequency: z.number().optional(),
  previousTraining: z.string().optional(),
  preferredExercise: z.string().optional(),
  accessToEquipment: z.string().optional(),

  // Step 6: Goals & Preferences
  primaryGoal: z.string(),
  targetAreas: z.string().optional(),
  preferredTime: z.enum(["Morning", "Afternoon", "Evening"]),
  workoutSetting: z.enum(["Gym", "Home", "Outdoor"]),
  motivationalFactor: z.string().optional(),
});

export { OnboardingSchema };
