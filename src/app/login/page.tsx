// app/login/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
    const [data, setData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const handleOnClick = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: data.email,
                password: data.password,
            });
            console.log('result', result)
            // if (result?.error) {
            //     setError(result.error);
            // } else {

            //     // router.push('/dashboard');
            // }
        } catch (err) {
            console.error("Sign-in error:", err);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
            <h1 className="text-xl font-bold mb-4">Login</h1>
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Enter Email</label>
                <input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleInputChange}
                    className="mt-1 p-2 block w-full border rounded-md text-black"
                    required
                />
            </div>
            <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Enter Password</label>
                <input
                    type="password"
                    name="password"
                    value={data.password}
                    onChange={handleInputChange}
                    className="mt-1 p-2 block w-full border rounded-md text-black"
                    required
                />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
                onClick={handleOnClick}
                disabled={loading}
                className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </div>
    );
}

export default LoginPage;
