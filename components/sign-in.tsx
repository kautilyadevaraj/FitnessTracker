import { auth, signIn, signOut } from "@/auth";
import { Button } from "./ui/button";

export default async function SignIn() {
  const session = await auth();

  const user = session?.user;
    return user ? (
      <Button
        type="submit"
        onClick={async () => {
          "use server";
          await signOut();
        }}
      >
        Sign Out
      </Button>
    ) : (
      <Button
        type="submit"
        onClick={async () => {
          "use server";
          await signIn("google");
        }}
      >Sign In</Button>
    );
}
