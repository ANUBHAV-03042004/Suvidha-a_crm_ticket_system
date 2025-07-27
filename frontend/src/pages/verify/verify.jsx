import "./verify.css";
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
// import { useNavigate } from "react-router-dom";

export const Verify = () => {
    // const navigate = useNavigate();
    const [success, setSuccess] = useState(false);
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();

    // Handle OTP verification on form submit
    const verify = async (e) => {
        e.preventDefault();

        // Check if OTP is entered before making the request
        if (!otp) {
            alert("Please enter OTP");
            return;
        }

        try {
            const response = await axios.post("/api/v1/user/verify", {otp});

            console.log(response.data);
            // Log the response for debugging

            if (response.status === 200) {
                setSuccess(true);
                navigate("/login");
                // navigate("/success");  // Navigate to success page on success
            } else {
                alert("Invalid OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error occurred during OTP verification:", error);
            alert("An error occurred while verifying the OTP. Please try again.");
        }
    };

    return (
        <>
            {!success ? (<form>
                <div className="inputBox">
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}  // Update OTP state
                        required
                    />
                    <span>OTP</span>
                </div>

                <button type="submit" onClick={verify}>Verify OTP</button>
            </form>) : <h1>Success</h1>}


        </>
    );
};
