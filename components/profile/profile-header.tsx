import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { EditProfileDialog } from "./edit-profile-dialog";
import { CalendarDays, Mail, User } from "lucide-react";
import { User as UserSchema } from "@prisma/client";


export function ProfileHeader({ user }: {user: UserSchema}) {
  return (
    <Card className="border-none shadow-md bg-gradient-to-r from-red-900/20 to-rose-500/20 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-rose-500 ring-2 ring-red-400 ring-offset-2 ring-offset-background">
            <AvatarImage
              src={user.image ?? undefined}
              alt={user.name ?? "User"}
            />
            <AvatarFallback>
              {user.name?.substring(0, 2).toUpperCase() ?? "US"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-muted-foreground">
              <div className="flex items-center justify-center md:justify-start gap-1">
                <User className="h-4 w-4" />
                <span>{user.username ?? "No Username"}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-1">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-1">
                <CalendarDays className="h-4 w-4" />
                <span>
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <EditProfileDialog user={user} />
        </div>
      </CardContent>
    </Card>
  );
}
