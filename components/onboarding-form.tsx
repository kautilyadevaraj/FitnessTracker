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

const OnboardingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(0, "Please enter a valid age"),
  gender: z.string().optional(),
  height: z.number().min(0, "Please enter your height in cm"),
  weight: z.number().min(0, "Please enter your weight in kg"),
  bodyFatPercentage: z.number().optional(),
  trainingPreference: z.enum(["gym", "home"]),
  benchPressMax: z.number().optional(),
  squatMax: z.number().optional(),
  deadliftMax: z.number().optional(),
});

type OnboardingData = z.infer<typeof OnboardingSchema>;

export default function MultiStepOnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ["Basic Info", "Physical Metrics", "Workout Preferences", "Review"];
  const progress = (currentStep / (steps.length - 1)) * 100;

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

  const onSubmit = (data: OnboardingData) => console.log("Final Data:", data);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <Label >Name</Label>
            <Input {...methods.register("name")} />
            <div className="mt-1"></div>
            <Label>Age</Label>
            <Input type="number" {...methods.register("age", { valueAsNumber: true })} />
            <Label>Gender</Label>
            <Input {...methods.register("gender")} />
          </>
        );
      case 1:
        return (
          <>
            <Label>Height (cm)</Label>
            <Input type="number" {...methods.register("height", { valueAsNumber: true })} />
            <Label>Weight (kg)</Label>
            <Input type="number" {...methods.register("weight", { valueAsNumber: true })} />
            <Label>Body Fat Percentage (%)</Label>
            <Input type="number" {...methods.register("bodyFatPercentage", { valueAsNumber: true })} />
          </>
        );
      case 2:
        return (
          <>
            <Label>Training Preference</Label>
            <Select {...methods.register("trainingPreference")}>  
              <SelectTrigger>
                <SelectValue placeholder="Select preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gym">Gym Workout</SelectItem>
                <SelectItem value="home">Home Workout</SelectItem>
              </SelectContent>
            </Select>
            {methods.watch("trainingPreference") === "gym" && (
              <>
                <Label>Bench Press Max (kg)</Label>
                <Input type="number" {...methods.register("benchPressMax", { valueAsNumber: true })} />
                <Label>Squat Max (kg)</Label>
                <Input type="number" {...methods.register("squatMax", { valueAsNumber: true })} />
                <Label>Deadlift Max (kg)</Label>
                <Input type="number" {...methods.register("deadliftMax", { valueAsNumber: true })} />
              </>
            )}
          </>
        );
      case 3:
        return <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(methods.getValues(), null, 2)}</pre>;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
     
         
          <Progress value={progress} className="mb-5" />
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="space-y-4 my-5">{renderStep()}</div>
            <div className="flex justify-between mt-6">
              {currentStep > 0 && <Button onClick={prevStep}>Back</Button>}
              {currentStep < steps.length - 1 ? (
                <Button onClick={nextStep}>Next</Button>
              ) : (
                <Button type="submit">Submit</Button>
              )}
            </div>
          </form>
      
    </FormProvider>
  );
}
