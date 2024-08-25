"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const DashboardPage = () => {
	const router = useRouter();
	const { data: session, status } = useSession();
	const [messages, setMessages] = useState<any[]>([]);
	const [loadingMessages, setLoadingMessages] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(0);

	// useEffect(() => {
	// 	if (status === "loading") {
	// 		return; // Just wait for the status to update
	// 	}
	// 	if (!session) {
	// 		router.push("/login"); // Redirect if not authenticated
	// 	} else {
	// 		// Fetch messages if authenticated
	// 		fetchMessages(1); // Default to page 1
	// 	}
	// }, [status, session, router]);

	useEffect(() => {
		fetchMessages(1);
	}, []);

	const fetchMessages = async (page: number) => {
		try {
			const response = await axios.post("/api/message/get", {
				page,
				limit: 10,
			});
			setMessages(response.data.data.messages);
			setTotalPages(response.data.data.totalPages);
			setLoadingMessages(false);
		} catch (error) {
			setError("Failed to fetch messages.");
			setLoadingMessages(false);
		}
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		fetchMessages(page);
	};

	if (status === "loading" || loadingMessages) {
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

			<button
				className="bg-blue-500 rounded-md m-5 p-2"
				onClick={() => fetchMessages(1)}
			>
				View Messages
			</button>

			{error && <p className="text-red-500">{error}</p>}

			<ul>
				{messages.length > 0 ? (
					messages.map((message) => (
						<li key={message._id} className="p-2 border-b">
							<p>{message.content}</p>
							<p className="text-sm text-gray-500">
								{new Date(message.createdAt).toLocaleString()}
							</p>
						</li>
					))
				) : (
					<p>No messages found.</p>
				)}
			</ul>

			<div>
				{Array.from({ length: totalPages }, (_, index) => (
					<button
						key={index + 1}
						className={`mx-1 p-2 ${
							currentPage === index + 1
								? "bg-blue-500 text-white"
								: "bg-gray-200"
						}`}
						onClick={() => handlePageChange(index + 1)}
					>
						{index + 1}
					</button>
				))}
			</div>
		</div>
	);
};

export default DashboardPage;
