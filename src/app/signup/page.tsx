"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BsIncognito } from "react-icons/bs";
import * as Yup from "yup";
import { validatePassword } from "@/utils/validatePassword";
import { PasswordRequirement } from "@/components/auth/passwordRequirement";

const SignupForm = () => {
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
	const [passwordFocused, setPasswordFocused] = useState(false);
	const [requirements, setRequirements] = useState([
		{ text: "At least 8 characters", fulfilled: false },
		{ text: "At least one lowercase letter", fulfilled: false },
		{ text: "At least one uppercase letter", fulfilled: false },
		{ text: "At least one number", fulfilled: false },
		{
			text: "At least one special character, e.g., ! @ # ?",
			fulfilled: false,
		},
	]);

	const handlePasswordChange = (password: string) => {
		const updatedRequirements = validatePassword(password);
		setRequirements(updatedRequirements);
		return updatedRequirements.every((req) => req.fulfilled);
	};

	const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
		event.preventDefault();
	};

	// Validation Schema
	const validationSchema = Yup.object().shape({
		username: Yup.string()
			.min(3, "Username must be at least 3 characters")
			.required("Required"),
		email: Yup.string().email("Invalid email address").required("Required"),
		password: Yup.string()
			.required("Required")
			.test(
				"is-strong-password",
				"Password must meet the requirements",
				function (value) {
					const isValid = handlePasswordChange(value || "");
					if (!isValid) {
						return this.createError({
							message: "Password must meet the requirements",
						});
					}
					return true;
				}
			),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref("password")], "Passwords must match")
			.required("Required"),
		terms: Yup.boolean().oneOf(
			[true],
			"You must accept the terms and conditions"
		),
	});

	const initialValues = {
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
		terms: false,
	};

	const onSubmit = (values: object) => {
		console.log(values);
	};

	return (
		<section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
			<div className="flex flex-col items-center justify-center min-w-[448px] px-6 py-8 mx-auto">
				<a
					href="#"
					className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
				>
					<BsIncognito className="mr-2" />
					Incognito
				</a>
				<div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
					<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
						<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
							Create an account
						</h1>
						<Formik
							initialValues={initialValues}
							validationSchema={validationSchema}
							onSubmit={onSubmit}
							validateOnChange
						>
							{({ isSubmitting, values, setFieldValue }) => (
								<Form className="space-y-4 md:space-y-6">
									<div className="max-w-sm">
										<label
											htmlFor="username"
											className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
										>
											Username
										</label>
										<Field
											type="text"
											name="username"
											id="username"
											placeholder="Your username"
											className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
										/>
										<ErrorMessage
											name="username"
											component="div"
											className="text-red-500 text-sm"
										/>
									</div>

									{/* Email */}
									<div className="max-w-sm">
										<label
											htmlFor="email"
											className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
										>
											Email
										</label>
										<Field
											type="email"
											name="email"
											id="email"
											placeholder="name@company.com"
											className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
										/>
										<ErrorMessage
											name="email"
											component="div"
											className="text-red-500 text-sm"
										/>
									</div>

									{/* Password Field */}
									<div className="max-w-sm">
										<label
											htmlFor="password"
											className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
										>
											Password
										</label>
										<div className="relative">
											<Field
												type={
													passwordVisible
														? "text"
														: "password"
												}
												name="password"
												id="password"
												placeholder="••••••••"
												className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
												onFocus={() =>
													setPasswordFocused(true)
												}
												// onBlur={() =>
												// 	setPasswordFocused(false)
												// }
												onChange={(
													e: React.ChangeEvent<HTMLInputElement>
												) => {
													const value =
														e.target.value;
													handlePasswordChange(value);
													setFieldValue(
														"password",
														value
													);
												}}
											/>
											<span
												className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
												onClick={() =>
													setPasswordVisible(
														!passwordVisible
													)
												}
											>
												{passwordVisible ? (
													<FaEyeSlash />
												) : (
													<FaEye />
												)}
											</span>
										</div>
										{passwordFocused && (
											<PasswordRequirement
												requirements={requirements}
											/>
										)}
										<ErrorMessage
											name="password"
											component="div"
											className="text-red-500 text-sm"
										/>
									</div>

									{/* Confirm Password Field */}
									<div className="max-w-sm">
										<label
											htmlFor="confirmPassword"
											className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
										>
											Confirm password
										</label>
										<div className="relative">
											<Field
												type={
													confirmPasswordVisible
														? "text"
														: "password"
												}
												name="confirmPassword"
												id="confirmPassword"
												placeholder="••••••••"
												className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
												onClick={() =>
													setConfirmPasswordVisible(
														!confirmPasswordVisible
													)
												}
												onPaste={handlePaste}
											/>
											<span
												className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
												onClick={() =>
													setConfirmPasswordVisible(
														!confirmPasswordVisible
													)
												}
											>
												{confirmPasswordVisible ? (
													<FaEyeSlash />
												) : (
													<FaEye />
												)}
											</span>
										</div>
										<ErrorMessage
											name="confirmPassword"
											component="div"
											className="text-red-500 text-sm"
										/>
									</div>

									{/* Terms & Conditions */}
									<div className="flex flex-col max-w-sm">
										<div className="flex items-center">
											<Field
												type="checkbox"
												name="terms"
												id="terms"
												className="w-4 h-4 text-primary-600 bg-gray-100 border border-gray-300 rounded focus:ring-primary-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
											/>
											<label
												htmlFor="terms"
												className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
											>
												I accept the{" "}
												<a
													href="#"
													className="font-medium text-primary-600 hover:underline dark:text-primary-500"
												>
													Terms and Conditions
												</a>
											</label>
										</div>
										<ErrorMessage
											name="terms"
											component="div"
											className="text-red-500 text-sm mt-1"
										/>
									</div>

									<button
										type="submit"
										disabled={isSubmitting}
										className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600 dark:focus:ring-primary-700"
									>
										Sign up
									</button>
								</Form>
							)}
						</Formik>
					</div>
				</div>
			</div>
		</section>
	);
};

export default SignupForm;
