// // app/dashboard/page.tsx
// import { getSession } from 'next-auth/react';
// import { GetServerSidePropsContext } from 'next';
// import { useSession, signOut } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { Session } from 'next-auth';

// interface DashboardProps {
//     session: Session | null; // Define the type for session
// }

// const DashboardPage: React.FC<DashboardProps> = ({ session }) => {
//     const { data: sessionData, status } = useSession();
//     const router = useRouter();

//     const handleLogout = async () => {
//         await signOut({ redirect: false });
//         router.push('/sign-in'); // Redirect to sign-in page after logout
//     };

//     if (status === 'loading') {
//         return <p>Loading...</p>;
//     }

//     if (!sessionData && !session) {
//         router.push('/sign-in'); // Redirect if not authenticated
//         return null;
//     }

//     // Use sessionData or fallback to session
//     const username = sessionData?.user?.username || session?.user?.username || "Guest";

//     return (
//         <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
//             <h1 className="text-xl font-bold mb-4">Welcome, {username}!</h1>
//             <p className="mb-6">This is your dashboard. You can add more components here based on your applications needs.</p>
//             <button 
//                 onClick={handleLogout} 
//                 className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
//             >
//                 Logout
//             </button>
//         </div>
//     );
// };

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//     const session = await getSession(context); // Fetch session data
//     return {
//         props: { session }, // Pass session as prop to the component
//     };
// }

// export default DashboardPage;



const DashboardPage = () => {
  return (
    <div>DashboardPage</div>
  )
}
export default DashboardPage