import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import LinkedIn from "next-auth/providers/linkedin";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { firestore } from "@/lib/firestore";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google, LinkedIn],
  adapter: FirestoreAdapter(firestore),
});
