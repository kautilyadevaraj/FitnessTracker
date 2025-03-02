"use client";
import MultiStepOnboardingForm from "@/components/onboarding-form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


import Loader from "@/components/Loader";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function OnboardingPage() {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Open</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle></AlertDialogTitle>
          <AlertDialogDescription>
            
          </AlertDialogDescription>
        </AlertDialogHeader>
        <MultiStepOnboardingForm/>
      </AlertDialogContent>
    </AlertDialog>
  );
}
