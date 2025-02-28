"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"

const personalInfoSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  age: z.string().refine((val) => !isNaN(Number.parseInt(val)) && Number.parseInt(val) > 0, {
    message: "Please enter a valid age.",
  }),
})

const fitnessGoalsSchema = z.object({
  primaryGoal: z.enum(["weight-loss", "muscle-gain", "endurance", "flexibility", "general-fitness"], {
    required_error: "Please select a primary fitness goal.",
  }),
  fitnessLevel: z.enum(["beginner", "intermediate", "advanced"], {
    required_error: "Please select your current fitness level.",
  }),
  workoutsPerWeek: z.string().min(1, { message: "Please select how many workouts per week." }),
})

const preferencesSchema = z.object({
  workoutDuration: z.string().min(1, { message: "Please select your preferred workout duration." }),
  workoutLocation: z.enum(["home", "gym", "outdoors", "mixed"], {
    required_error: "Please select where you plan to work out.",
  }),
  additionalInfo: z.string().optional(),
})

type FormStep = "personal" | "goals" | "preferences" | "complete"

export default function OnboardingForm() {
  const [step, setStep] = useState<FormStep>("personal")

  // Personal Info Form
  const personalForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: "",
      email: "",
      age: "",
    },
  })

  // Fitness Goals Form
  const goalsForm = useForm<z.infer<typeof fitnessGoalsSchema>>({
    resolver: zodResolver(fitnessGoalsSchema),
    defaultValues: {
      primaryGoal: undefined,
      fitnessLevel: undefined,
      workoutsPerWeek: "3",
    },
  })

  // Preferences Form
  const preferencesForm = useForm<z.infer<typeof preferencesSchema>>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      workoutDuration: "30",
      workoutLocation: undefined,
      additionalInfo: "",
    },
  })

  function onPersonalSubmit(data: z.infer<typeof personalInfoSchema>) {
    setStep("goals")
  }

  function onGoalsSubmit(data: z.infer<typeof fitnessGoalsSchema>) {
    setStep("preferences")
  }

  function onPreferencesSubmit(data: z.infer<typeof preferencesSchema>) {
    setStep("complete")
    // Here you would typically submit all form data to your backend
    console.log({
      ...personalForm.getValues(),
      ...goalsForm.getValues(),
      ...preferencesForm.getValues(),
    })
  }

  return (
    <div className="space-y-4 p-2">
      {/* Progress Indicator */}
      <div className="flex justify-between mb-6">
        {["personal", "goals", "preferences", "complete"].map((s, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                step === s
                  ? "border-primary bg-primary text-primary-foreground"
                  : step === "complete" ||
                      (s === "goals" && step === "preferences") ||
                      (s === "goals" && step === "complete") ||
                      (s === "preferences" && step === "complete")
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/20 text-muted-foreground"
              }`}
            >
              {step === "complete" ||
              (s === "goals" && step === "preferences") ||
              (s === "goals" && step === "complete") ||
              (s === "preferences" && step === "complete") ? (
                <Check className="h-4 w-4" />
              ) : (
                i + 1
              )}
            </div>
            <span className="mt-1 text-xs text-muted-foreground capitalize">{s}</span>
          </div>
        ))}
      </div>

      {/* Personal Info Step */}
      {step === "personal" && (
        <Form {...personalForm}>
          <form onSubmit={personalForm.handleSubmit(onPersonalSubmit)} className="space-y-4">
            <FormField
              control={personalForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={personalForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={personalForm.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your age" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
      )}

      {/* Fitness Goals Step */}
      {step === "goals" && (
        <Form {...goalsForm}>
          <form onSubmit={goalsForm.handleSubmit(onGoalsSubmit)} className="space-y-4">
            <FormField
              control={goalsForm.control}
              name="primaryGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Fitness Goal</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your primary goal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="weight-loss">Weight Loss</SelectItem>
                      <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                      <SelectItem value="endurance">Endurance</SelectItem>
                      <SelectItem value="flexibility">Flexibility</SelectItem>
                      <SelectItem value="general-fitness">General Fitness</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={goalsForm.control}
              name="fitnessLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Fitness Level</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="beginner" />
                        </FormControl>
                        <FormLabel className="font-normal">Beginner</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="intermediate" />
                        </FormControl>
                        <FormLabel className="font-normal">Intermediate</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="advanced" />
                        </FormControl>
                        <FormLabel className="font-normal">Advanced</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={goalsForm.control}
              name="workoutsPerWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workouts Per Week: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={7}
                      step={1}
                      defaultValue={[Number.parseInt(field.value)]}
                      onValueChange={(vals) => field.onChange(vals[0].toString())}
                      className="py-4"
                    />
                  </FormControl>
                  <FormDescription>How many days per week can you commit to working out?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button variant="outline" type="button" onClick={() => setStep("personal")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button type="submit" className="flex-1">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      )}

      {/* Preferences Step */}
      {step === "preferences" && (
        <Form {...preferencesForm}>
          <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-4">
            <FormField
              control={preferencesForm.control}
              name="workoutDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Workout Duration: {field.value} minutes</FormLabel>
                  <FormControl>
                    <Slider
                      min={15}
                      max={90}
                      step={15}
                      defaultValue={[Number.parseInt(field.value)]}
                      onValueChange={(vals) => field.onChange(vals[0].toString())}
                      className="py-4"
                    />
                  </FormControl>
                  <FormDescription>How long do you prefer your workouts to be?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={preferencesForm.control}
              name="workoutLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workout Location</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select where you plan to work out" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="gym">Gym</SelectItem>
                      <SelectItem value="outdoors">Outdoors</SelectItem>
                      <SelectItem value="mixed">Mixed (Combination)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={preferencesForm.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any injuries, limitations, or specific preferences we should know about?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button variant="outline" type="button" onClick={() => setStep("goals")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button type="submit" className="flex-1">
                Complete <Check className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      )}

      {/* Complete Step */}
      {step === "complete" && (
        <div className="flex flex-col items-center justify-center space-y-4 py-6 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Check className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold">You're all set!</h3>
          <p className="text-muted-foreground">
            Thank you for completing the onboarding process. Your personalized fitness plan is being created.
          </p>
          <Button className="w-full">View Your Dashboard</Button>
        </div>
      )}
    </div>
  )
}

