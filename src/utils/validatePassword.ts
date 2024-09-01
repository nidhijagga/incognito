// utils/passwordRequirements.ts
const passwordRequirements = [
	{
		text: "At least 8 characters",
		test: (value: string) => value.length >= 8,
	},
	{
		text: "At least one lowercase letter",
		test: (value: string) => /[a-z]/.test(value),
	},
	{
		text: "At least one uppercase letter",
		test: (value: string) => /[A-Z]/.test(value),
	},
	{ text: "At least one number", test: (value: string) => /\d/.test(value) },
	{
		text: "At least one special character, e.g., ! @ # ?",
		test: (value: string) => /[^\w\s]/.test(value), // Any non-alphanumeric character
	},
];

export const validatePassword = (password: string) => {
	return passwordRequirements.map((req) => ({
		text: req.text,
		fulfilled: req.test(password),
	}));
};
