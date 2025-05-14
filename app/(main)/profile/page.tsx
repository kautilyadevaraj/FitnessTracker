import { UserProfile } from "@/components/profile/user-profile";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();
    if (!session) {
      redirect("/login");
    }
  return (
    <div className="container mx-auto py-8 px-4">
      <UserProfile />
    </div>
  );
}
