import { useState } from "react";
import {toast} from "sonner";
import { useAdminContext } from "../context/AdminLoginContext";

const useAdminLogin = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthAdmin } = useAdminContext();

	const login = async (username, password) => {
		const success = handleInputErrors(username, password);
		if (!success) return;
		setLoading(true);
		try {
			const res = await fetch("http://localhost:5001/api/admin/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
			});

			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}

			localStorage.setItem("Empty", JSON.stringify(data));
			setAuthAdmin(data);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, login };
};
export default useAdminLogin;

function handleInputErrors(username, password) {
	if (!username || !password) {
		toast.error("Please fill in all fields");
		return false;
	}

	return true;
}