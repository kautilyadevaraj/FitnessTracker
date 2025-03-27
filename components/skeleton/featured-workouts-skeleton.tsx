import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

export default function FeaturedWorkoutsSkeleton() {
  return (
    <section className="space-y-4">
      
      <Carousel className="w-full">
        <CarouselContent>
          {Array.from({ length: 3 }).map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="relative h-[300px] overflow-hidden rounded-xl">
                <Skeleton className="h-full w-full" />
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <Skeleton className="h-6 w-20 mb-2" />
                  <Skeleton className="h-7 w-3/4 mb-2" />
                  <div className="flex items-center gap-4 mb-3">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </section>
  );
}
