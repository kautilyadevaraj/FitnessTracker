import MultiStepOnboardingForm from "@/components/onboarding-form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";


export default function OnboardingPage() {
  return (
    <div>
      <Sheet>
        <SheetTrigger>
          <Button>Open</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <MultiStepOnboardingForm></MultiStepOnboardingForm>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}
