import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/login-form";


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const { loading, login } = useLogin();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await login(username, password);
	};

	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
					
				<div >
					  <Card>
						<CardHeader>
						  <CardTitle className="text-2xl">Login to Zerox</CardTitle>
						  <CardDescription>
							Enter your username below to login to your account
						  </CardDescription>
						</CardHeader>
						<CardContent>
						<form onSubmit={handleSubmit}>
							<div className="flex flex-col gap-6">
							  <div className="grid gap-3">
								<Label htmlFor="username">Username</Label>
								<Input
								  type='text'
								  placeholder='Enter username'
								  className='w-full input input-bordered h-10'
								  value={username}
								  id = 'username'
								  onChange={(e) => setUsername(e.target.value)}
								/>
							  </div>
							  <div className="grid gap-3">
								<div className="flex items-center">
								  <Label htmlFor="password">Password</Label>
								  <a
									href="#"
									className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
								  >
									Forgot your password?
								  </a>
								</div>
								<Input type='password'
							placeholder='Enter Password'
							className='w-full input input-bordered h-10'
							value={password}
							onChange={(e) => setPassword(e.target.value)} />
							  </div>
							  <div className="flex flex-col gap-3">
								<Button type="submit" className="w-full">
								  Login
								</Button>
								<Button variant="outline" className="w-full">
								  Login with Google
								</Button>
							  </div>
							</div>
							<div className="mt-4 text-center text-sm">
							  Don&apos;t have an account?{" "}
							  <a href="/signup" className="underline underline-offset-4">
								Sign up
							  </a>
							</div>
						  </form>
						</CardContent>
					  </Card>
					</div>
				
					


			</div>
		</div>
	);
};
export default Login;

