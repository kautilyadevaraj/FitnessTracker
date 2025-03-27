"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";

export default function DynamicBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home Link */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="md:block" />
        {/* Dynamically generated breadcrumb items */}
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;

          return (
            <span key={href} className="flex items-center">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  {isLast ? (
                    <span className="text-muted-foreground">
                      {capitalize(decodeURIComponent(segment))}
                    </span>
                  ) : (
                    <Link href={href}>
                      {capitalize(decodeURIComponent(segment))}
                    </Link>
                  )}
                </BreadcrumbLink>
              </BreadcrumbItem>

              {/* Separator except for the last item */}
              {!isLast && <BreadcrumbSeparator className="md:block pl-3" />}
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
