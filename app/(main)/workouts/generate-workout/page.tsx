import Chat from "@/components/workout/chat";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  return (
    <div className="w-full h-full flex justify-center items-end">
      <Chat />
    </div>
  );
}
