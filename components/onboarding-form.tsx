// MultiStepOnboardingForm.tsx
"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define validation schema for each field; you can combine multiple schemas if needed.
const OnboardingSchema = z.object({
  // Step 1: Basic Info
  name: z.string().min(1, "Name is required"),
  age: z.number().min(0, "Please enter a valid age"),
  gender: z.string().optional(),
  // Step 2: Physical Metrics
  height: z.number().min(0, "Please enter your height in cm"),
  weight: z.number().min(0, "Please enter your weight in kg"),
  bodyFatPercentage: z.number().optional(),
  // Step 3: Workout Preferences
  trainingPreference: z.enum(["gym", "home"]),
  // Gym-specific fields (optional if trainingPreference is 'gym')
  benchPressMax: z.number().optional(),
  squatMax: z.number().optional(),
  deadliftMax: z.number().optional(),
  // Additional fields can be added as necessary
});

type OnboardingData = z.infer<typeof OnboardingSchema>;

export default function MultiStepOnboardingForm() {
  // Manage current step index
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    "Basic Info",
    "Physical Metrics",
    "Workout Preferences",
    "Review",
  ];

  // Initialize react-hook-form with the complete schema
  const methods = useForm<OnboardingData>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      name: "",
      age: 0,
      gender: "",
      height: 0,
      weight: 0,
      bodyFatPercentage: undefined,
      trainingPreference: "gym",
      benchPressMax: undefined,
      squatMax: undefined,
      deadliftMax: undefined,
    },
  });

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const onSubmit = (data: OnboardingData) => {
    // Here, you can send the data to your API endpoint to save in Supabase/PostgreSQL
    console.log("Final Data:", data);
  };

  // Render different form sections based on current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <h2 className="text-lg font-bold">Basic Info</h2>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...methods.register("name")} />
              {methods.formState.errors.name && (
                <p className="text-red-500 text-sm">
                  {methods.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                {...methods.register("age", { valueAsNumber: true })}
              />
              {methods.formState.errors.age && (
                <p className="text-red-500 text-sm">
                  {methods.formState.errors.age.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gender">Gender</Label>
              <Input id="gender" {...methods.register("gender")} />
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <h2 className="text-lg font-bold">Physical Metrics</h2>
            <div className="grid gap-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                {...methods.register("height", { valueAsNumber: true })}
              />
              {methods.formState.errors.height && (
                <p className="text-red-500 text-sm">
                  {methods.formState.errors.height.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                {...methods.register("weight", { valueAsNumber: true })}
              />
              {methods.formState.errors.weight && (
                <p className="text-red-500 text-sm">
                  {methods.formState.errors.weight.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bodyFatPercentage">Body Fat Percentage (%)</Label>
              <Input
                id="bodyFatPercentage"
                type="number"
                {...methods.register("bodyFatPercentage", {
                  valueAsNumber: true,
                })}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-lg font-bold">Workout Preferences</h2>
            <div className="grid gap-2">
              <Label htmlFor="trainingPreference">Training Preference</Label>
              <select
                id="trainingPreference"
                {...methods.register("trainingPreference")}
              >
                <option value="gym">Gym Workout</option>
                <option value="home">Home Workout</option>
              </select>
            </div>
            {/* Conditionally render gym-specific fields */}
            {methods.watch("trainingPreference") === "gym" && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="benchPressMax">Bench Press Max (kg)</Label>
                  <Input
                    id="benchPressMax"
                    type="number"
                    {...methods.register("benchPressMax", {
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="squatMax">Squat Max (kg)</Label>
                  <Input
                    id="squatMax"
                    type="number"
                    {...methods.register("squatMax", { valueAsNumber: true })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deadliftMax">Deadlift Max (kg)</Label>
                  <Input
                    id="deadliftMax"
                    type="number"
                    {...methods.register("deadliftMax", {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </>
            )}
            {/* For home workouts, you might display alternative fields or instructions */}
          </div>
        );
      case 3:
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
