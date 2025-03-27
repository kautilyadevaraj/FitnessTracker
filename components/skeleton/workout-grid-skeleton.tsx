import WorkoutCardSkeleton from "./workout-card-skeleton";

export default function WorkoutGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <WorkoutCardSkeleton key={index} />
      ))}
    </div>
  );
}
