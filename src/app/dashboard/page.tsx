"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DashboardPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") {
      return; // Just wait for the status to update
    }
    if (!session) {
      router.push("/login"); // Redirect if not authenticated
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return null; // Return null to prevent rendering when not authenticated
  }

  return (
    <div>
      <p>Welcome, {session.user.username}!</p>
      <button
        className="bg-orange-500 rounded-md m-5 p-2"
        onClick={() => signOut()}
      >
        Logout
      </button>
      {status === "authenticated" && <p>You are logged in.</p>}
    </div>
  );
};

export default DashboardPage;
