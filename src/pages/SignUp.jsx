import React, { useState } from "react";
import { Link } from "react-router-dom";
import useSignup from "../hooks/useSignup";
import {
  Card, CardHeader, CardDescription, CardTitle, CardContent, CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const SignUp = () => {
  const [inputs, setInputs] = useState({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "", // ✅ Keep this consistent with `useSignup.js`
    password: "",
    confirmPassword: "",
    gender: "",
  });  

  const { loading, signup } = useSignup();

  const handleSubmit = async (e) => {
    console.log(inputs)
    e.preventDefault();
    await signup(inputs);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up for Zerox</CardTitle>
            <CardDescription>
              <p className="text-gray-500">Join us today and revolutionize your printing experience.</p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" type="text" placeholder="Enter your full name" 
                  value={inputs.fullName} onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="text" placeholder="Choose a unique username" 
                  value={inputs.username} onChange={(e) => setInputs({ ...inputs, username: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" 
                  value={inputs.email} onChange={(e) => setInputs({ ...inputs, email: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" type="tel" placeholder="Enter your phone number" 
                  value={inputs.phoneNumber} onChange={(e) => setInputs({ ...inputs, phoneNumber: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter a secure password" 
                  value={inputs.password} onChange={(e) => setInputs({ ...inputs, password: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" placeholder="Confirm your password" 
                  value={inputs.confirmPassword} onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="gender" className="block mb-1">
                  Gender
                </Label>
                <Select
                  value={inputs.gender}
                  onValueChange={(value) =>
                    setInputs({ ...inputs, gender: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Link to="/login" className="text-sm mt-4 inline-block">Already have an account? Sign In</Link>
              </div>
              <div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <span className="loading loading-spinner"></span> : "Sign Up"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-gray-500">By creating an account, you agree to our Terms and Conditions.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;