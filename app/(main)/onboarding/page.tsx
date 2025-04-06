"use client";
import { useState } from "react";
import MultiStepOnboardingForm from "@/components/onboarding-form";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function OnboardingPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Welcome to Onboarding!</AlertDialogTitle>
          <AlertDialogDescription>
            Please complete the steps in the form below to get started.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <MultiStepOnboardingForm />
      </AlertDialogContent>
    </AlertDialog>
  );
}
