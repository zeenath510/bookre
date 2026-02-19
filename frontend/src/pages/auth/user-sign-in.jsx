import {
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_URL from "../../configs/api";

export function UserSignIn() {
  const [uname, setUname] = useState("");
  const [upass, setUpass] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // DEBUG: Show API URL to verify environment variable
    console.log("Current API_URL:", API_URL);
    toast.info(`Connecting to: ${API_URL}`, { autoClose: 5000 });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!uname || !upass) {
      toast.error("Please enter username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uname: uname.trim(), upass: upass.trim() }), // ✅ match backend
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);

        // save logged in user info
        localStorage.setItem("user", JSON.stringify(data.user));

        setTimeout(() => {
          navigate("/user/home");
        }, 1000);
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch {
      toast.error("Network error. Please try again later.");
    }

    setLoading(false);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <section className="h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
          <div className="text-center">
            <Typography variant="h2" className="font-bold mb-4">
              Sign In
            </Typography>
            <Typography
              variant="paragraph"
              color="blue-gray"
              className="text-lg font-normal"
            >
              Enter your name and password to sign in.
            </Typography>
          </div>

          <form className="mt-8 flex flex-col gap-6" onSubmit={handleSubmit}>
            <div>
              <Input
                size="lg"
                placeholder="Enter Your Name"
                value={uname}
                onChange={(e) => setUname(e.target.value)}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>

            <div>
              <Input
                size="lg"
                type="password"
                placeholder="Enter Your Password"
                value={upass}
                onChange={(e) => setUpass(e.target.value)}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>

            <Button className="mt-6" fullWidth disabled={loading} type="submit">
              {loading ? "Signing In..." : "Login Now"}
            </Button>

            <Typography
              variant="paragraph"
              className="text-center text-blue-gray-500 font-medium mt-4"
            >
              Don't have an account?
              <Link to="/auth/user-sign-up" className="text-gray-900 ml-1">
                Sign up
              </Link>
            </Typography>
          </form>
        </div>
      </section>
    </>
  );
}

export default UserSignIn;
