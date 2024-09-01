"use client";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
interface Requirement {
	text: string;
	fulfilled: boolean;
}

interface PasswordRequirementProps {
	requirements: Requirement[];
}

export const PasswordRequirement: React.FC<PasswordRequirementProps> = ({
	requirements,
}) => {
	return (
		<ul className="max-w-md text-xs space-y-1 text-gray-500 list-inside dark:text-gray-400 mb-2">
			{requirements.map((req, index) => (
				<li className="flex items-center" key={index}>
					<CheckMark fulfilled={req.fulfilled} />
					{req.text}
				</li>
			))}
		</ul>
	);
};

interface CheckMarkProps {
	fulfilled: boolean;
}

const CheckMark: React.FC<CheckMarkProps> = ({ fulfilled }) => {
	return (
		<FaCheckCircle
			className={`mr-2 flex-shrink-0 w-4 h-4 ${
				fulfilled ? "text-green-500" : "text-gray-400"
			}`}
			aria-hidden="true"
		/>
	);
};
