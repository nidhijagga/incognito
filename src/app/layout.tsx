import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/context/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Incognito",
	description: "Incognito",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<Provider session={null}>
				<body className={inter.className}>{children}</body>
			</Provider>
		</html>
	);
}
