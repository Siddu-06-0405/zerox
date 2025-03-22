import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

const ChangeEmailAndPassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [newEmail, setNewEmail] = useState("");

    const handleChangePassword = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("print-user"));
            console.log(user);
            
            if (!user || !user.token) {
                toast.error("You need to log in first!");
                return;
            }

            const userId = user._id;
            const { data } = await axios.put("http://localhost:5001/api/auth/change-password", { userId, oldPassword, newPassword }, { withCredentials: true });
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to update password");
        }
    };

    const handleChangeEmail = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("print-user"));
                if (!user || !user.token) {
                  toast.error("You need to log in first!");
                  return;
                }
              
            const userId = user._id;
            const { data } = await axios.put("http://localhost:5001/api/auth/change-email", {userId, newEmail }, { withCredentials: true });
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to update email");
        }
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
                <Input placeholder="Current Password" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                <Input placeholder="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-2" />
                <Button onClick={handleChangePassword} className="mt-4 w-full">Update Password</Button>
            </CardContent>

            <CardHeader>
                <CardTitle>Change Email</CardTitle>
            </CardHeader>
            <CardContent>
                <Input placeholder="New Email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                <Button onClick={handleChangeEmail} className="mt-4 w-full">Update Email</Button>
            </CardContent>
        </Card>
    );
};

export default ChangeEmailAndPassword;