"use client";

import type React from "react";

import { useState } from "react";
import type { Exercise } from "@/types/schema-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ExerciseEditFormProps {
  exercise: Exercise;
  onSave: (updatedExercise: Exercise) => void;
}

export default function ExerciseEditForm({
  exercise,
  onSave,
}: ExerciseEditFormProps) {
  const [formData, setFormData] = useState<Exercise>({
    ...exercise,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="name">Exercise Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="equipment">Equipment</Label>
        <Input
          id="equipment"
          name="equipment"
          value={formData.equipment}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="estimatedTime">Estimated Time</Label>
        <Input
          id="estimatedTime"
          name="estimatedTime"
          value={formData.estimatedTime}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="repsAndSets">Sets & Reps</Label>
        <Input
          id="repsAndSets"
          name="repsAndSets"
          value={formData.repsAndSets}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetedArea">Targeted Areas (comma separated)</Label>
        <Input
          id="targetedArea"
          name="targetedArea"
          value={formData.targetedArea}
          onChange={handleChange}
        />
      </div>

      <Button type="submit" className="w-full">
        Save Changes
      </Button>
    </form>
  );
}
