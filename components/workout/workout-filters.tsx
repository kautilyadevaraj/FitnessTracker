"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export default function WorkoutFilters() {
  const [duration, setDuration] = React.useState([30]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Difficulty Level</Label>
          <RadioGroup defaultValue="all">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">All Levels</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="beginner" id="beginner" />
              <Label htmlFor="beginner">Beginner</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="intermediate" id="intermediate" />
              <Label htmlFor="intermediate">Intermediate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="advanced" id="advanced" />
              <Label htmlFor="advanced">Advanced</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Duration (minutes)</Label>
            <span className="text-sm text-muted-foreground">
              {duration[0]} min
            </span>
          </div>
          <Slider
            defaultValue={[30]}
            max={90}
            min={5}
            step={5}
            onValueChange={setDuration}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5 min</span>
            <span>90 min</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Workout Type</Label>
          <div className="space-y-2">
            {["Strength", "Cardio", "HIIT", "Yoga", "Pilates"].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox id={type.toLowerCase()} />
                <Label htmlFor={type.toLowerCase()}>{type}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Equipment</Label>
          <div className="space-y-2">
            {[
              "No Equipment",
              "Dumbbells",
              "Resistance Bands",
              "Kettlebell",
              "Barbell",
            ].map((equipment) => (
              <div key={equipment} className="flex items-center space-x-2">
                <Checkbox id={equipment.toLowerCase().replace(/\s+/g, "-")} />
                <Label htmlFor={equipment.toLowerCase().replace(/\s+/g, "-")}>
                  {equipment}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1">Apply Filters</Button>
          <Button variant="outline" className="flex-1">
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
