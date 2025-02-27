"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

// Define validation schema
const OnboardingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(0, "Please enter a valid age"),
  gender: z.string().optional(),

  // Step 2: Physical Metrics
  height: z.number().min(0, "Please enter your height in cm"),
  weight: z.number().min(0, "Please enter your weight in kg"),
  bodyFatPercentage: z.number().optional(),
  vo2Max: z.number().optional(),
  flexibility: z.number().optional(),

  // Step 3: Workout Experience
  trainingFrequency: z.number().optional(), // Number of workouts per week
  trainingExperience: z.string().optional(), // e.g., beginner, intermediate, advanced
  workoutGoal: z.string().optional(), // e.g., strength, endurance, hypertrophy

  // Step 4: Workout Preferences
  trainingPreference: z.enum(["gym", "home"]),
  benchPressMax: z.number().optional(),
  squatMax: z.number().optional(),
  deadliftMax: z.number().optional(),
});

type OnboardingData = z.infer<typeof OnboardingSchema>;

export default function MultiStepOnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    "Basic Info",
    "Physical Metrics",
    "Training Details",
    "Workout Preferences",
    "Review",
  ];

  const methods = useForm<OnboardingData>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      name: "",
      age: 0,
      gender: "",
      height: 0,
      weight: 0,
      bodyFatPercentage: undefined,
      vo2Max: undefined,
      flexibility: undefined,
      trainingFrequency: undefined,
      trainingExperience: "",
      workoutGoal: "",
      trainingPreference: "gym",
      benchPressMax: undefined,
      squatMax: undefined,
      deadliftMax: undefined,
    },
  });

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);
  const onSubmit = async (data: OnboardingData) => {
    console.log("Final Data:", data);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <h2 className="text-lg font-bold">Basic Info</h2>
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input {...methods.register("name")} />
              {methods.formState.errors.name && (
                <p className="text-red-500 text-sm">
                  {methods.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Age</Label>
              <Input
                type="number"
                {...methods.register("age", { valueAsNumber: true })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Gender</Label>
              <Input {...methods.register("gender")} />
            </div>
          </div>
        );

      case 1:
        return (
          <div>
            <h2 className="text-lg font-bold">Physical Metrics</h2>
            <div className="grid gap-2">
              <Label>Height (cm)</Label>
              <Input
                type="number"
                {...methods.register("height", { valueAsNumber: true })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Weight (kg)</Label>
              <Input
                type="number"
                {...methods.register("weight", { valueAsNumber: true })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Body Fat Percentage (%)</Label>
              <Input
                type="number"
                {...methods.register("bodyFatPercentage", {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div className="grid gap-2">
              <Label>VO2 Max (mL/kg/min)</Label>
              <Input
                type="number"
                {...methods.register("vo2Max", { valueAsNumber: true })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Flexibility (cm)</Label>
              <Input
                type="number"
                {...methods.register("flexibility", { valueAsNumber: true })}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-lg font-bold">Training Details</h2>
            <div className="grid gap-2">
              <Label>Training Frequency (per week)</Label>
              <Input
                type="number"
                {...methods.register("trainingFrequency", {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Training Experience</Label>
              <Input
                {...methods.register("trainingExperience")}
                placeholder="Beginner, Intermediate, Advanced"
              />
            </div>
            <div className="grid gap-2">
              <Label>Workout Goal</Label>
              <Input
                {...methods.register("workoutGoal")}
                placeholder="Strength, Endurance, Hypertrophy"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="text-lg font-bold">Workout Preferences</h2>
            <div className="grid gap-2">
              <Label>Training Preference</Label>
              <select {...methods.register("trainingPreference")}>
                <option value="gym">Gym Workout</option>
                <option value="home">Home Workout</option>
              </select>
            </div>
            {methods.watch("trainingPreference") === "gym" && (
              <>
                <div className="grid gap-2">
                  <Label>Bench Press Max (kg)</Label>
                  <Input
                    type="number"
                    {...methods.register("benchPressMax", {
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Squat Max (kg)</Label>
                  <Input
                    type="number"
                    {...methods.register("squatMax", { valueAsNumber: true })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Deadlift Max (kg)</Label>
                  <Input
                    type="number"
                    {...methods.register("deadliftMax", {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </>
            )}
          </div>
        );

      case 4:
        return (
          <div>
            <h2 className="text-lg font-bold">Review & Submit</h2>
            <pre className="bg-gray-100 p-4 rounded">
              {JSON.stringify(methods.getValues(), null, 2)}
            </pre>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {renderStep()}
            <div className="flex justify-between mt-4">
              {currentStep > 0 && (
                <Button type="button" onClick={prevStep}>
                  Back
                </Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button type="submit">Submit</Button>
              )}
            </div>
          </form>
        
    </FormProvider>
  );
}
