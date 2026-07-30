// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { signIn } from "next-auth/react";


// export default function LoginPage() {
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpLoading, setOtpLoading] = useState(false);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (
//   e: React.FormEvent<HTMLFormElement>
// ) => {
//   e.preventDefault();

//   setLoading(true);

//   try {
//     const result = await signIn("credentials", {
//       email: formData.email,
//       password: formData.password,
//       redirect: false,
//     });

//     if (result?.error) {
//       alert("Invalid email or password");
//       return;
//     }

//     alert("Login Successful 🎉");

//     // Get logged-in user info
// const meResponse = await fetch("/api/me");

// if (!meResponse.ok) {
//   router.replace("/dashboard");
//   router.refresh();
//   return;
// }

// const user = await meResponse.json();

// // Redirect based on role
// if (user.isTailor) {
//   router.replace("/tailor-dashboard");
// } else {
//   router.replace("/dashboard");
// }
//     router.refresh();
//   } catch (error) {
//     console.error(error);
//     alert("Something went wrong.");
//   } finally {
//     setLoading(false);
//   }
// };

// const sendOtp = async () => {
//   if (!phone) {
//     alert("Enter phone number");
//     return;
//   }

//   setOtpLoading(true);

//   try {
//     const response = await fetch("/api/auth/send-otp", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         phone,
//       }),
//     });

//     const data = await response.json();

//     if (!data.success) {
//       alert(data.message || "Failed to send OTP");
//       return;
//     }

//     setOtpSent(true);
//     alert("OTP sent successfully");
//   } catch (error) {
//     console.error(error);
//     alert("Failed to send OTP");
//   } finally {
//     setOtpLoading(false);
//   }
// };

// const verifyPhoneLogin = async () => {
//   if (!otp) {
//     alert("Enter OTP");
//     return;
//   }

//   setOtpLoading(true);

//   try {
//     const result = await signIn("phone-otp", {
//       phone,
//       otp,
//       redirect: false,
//     });

//     if (result?.error) {
//       alert(result.error);
//       return;
//     }

//     alert("Phone Login Successful 🎉");

//     router.replace("/dashboard");
//     router.refresh();
//   } catch (error) {
//     console.error(error);
//     alert("Something went wrong");
//   } finally {
//     setOtpLoading(false);
//   }
// };

//   return (
//     <main className="min-h-screen grid lg:grid-cols-2">

//       {/* LEFT SECTION */}

//       <div className="hidden lg:flex flex-col justify-center bg-amber-700 p-16 text-white">

//         <h1 className="text-5xl font-bold">
//           Welcome Back 👋
//         </h1>

//         <p className="mt-6 text-lg leading-8 text-amber-100">
//           Login to continue your tailoring journey with Dhaga.
//           Manage your orders, upload designs, schedule home
//           measurements and track every stitch.
//         </p>

//         <div className="mt-12 space-y-5 text-lg">

//           <div>✔ Verified Tailors</div>

//           <div>✔ Live Order Tracking</div>

//           <div>✔ Home Measurement</div>

//           <div>✔ Secure Payments</div>

//           <div>✔ Saved Measurements</div>

//         </div>

//       </div>

//       {/* RIGHT SECTION */}

//       <div className="flex items-center justify-center bg-gray-50 p-8">

//         <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl">

//           <h2 className="text-4xl font-bold text-gray-900">
//             Login
//           </h2>

//           <p className="mt-2 text-gray-500">
//             Welcome back to Dhaga.
//           </p>

//           {/* ================= PHONE LOGIN ================= */}

// <div className="mt-8">
//   <h3 className="text-lg font-semibold text-gray-900">
//     Continue with Phone
//   </h3>

//   <input
//     type="text"
//     placeholder="+91XXXXXXXXXX"
//     value={phone}
//     onChange={(e) => setPhone(e.target.value)}
//     className="mt-4 w-full rounded-xl border border-gray-300 p-4 text-gray-900 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
//   />

//   {!otpSent ? (
//     <button
//       type="button"
//       onClick={sendOtp}
//       disabled={otpLoading}
//       className="mt-4 w-full rounded-xl bg-green-600 py-4 text-lg font-semibold text-white hover:bg-green-700 disabled:opacity-50"
//     >
//       {otpLoading ? "Sending OTP..." : "Send OTP"}
//     </button>
//   ) : (
//     <>
//       <input
//         type="text"
//         placeholder="Enter OTP"
//         value={otp}
//         onChange={(e) => setOtp(e.target.value)}
//         className="mt-4 w-full rounded-xl border border-gray-300 p-4 text-gray-900 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
//       />

//       <button
//         type="button"
//         onClick={verifyPhoneLogin}
//         disabled={otpLoading}
//         className="mt-4 w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
//       >
//         {otpLoading ? "Verifying..." : "Verify & Login"}
//       </button>
//     </>
//   )}
// </div>

// <div className="my-8 flex items-center">
//   <div className="h-px flex-1 bg-gray-300"></div>
//   <span className="px-4 text-sm text-gray-400">
//     OR LOGIN WITH EMAIL
//   </span>
//   <div className="h-px flex-1 bg-gray-300"></div>
// </div>

//           <form
//             onSubmit={handleSubmit}
//             className="mt-8 space-y-5"
//           >

//             <input
//               type="email"
//               name="email"
//               placeholder="Email Address"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="w-full rounded-xl border border-gray-300 p-4 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
//             />

//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className="w-full rounded-xl border border-gray-300 p-4 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
//             />

//             <div className="flex justify-end">

//               <Link
//                 href="#"
//                 className="text-sm font-medium text-amber-700 hover:underline"
//               >
//                 Forgot Password?
//               </Link>

//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full rounded-xl bg-amber-700 py-4 text-lg font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               {loading ? "Logging In..." : "Login"}
//             </button>

//           </form>

          

//           <p className="text-center text-gray-600">

//             Don't have an account?{" "}

//             <Link
//               href="/register"
//               className="font-semibold text-amber-700 hover:underline"
//             >
//               Create Account
//             </Link>

//           </p>

//         </div>

//       </div>

//     </main>
//   );
// }

"use client";

import { useState } from "react";

import LoginChoice from "./components/LoginChoice";
import PhoneLogin from "./components/PhoneLogin";
import EmailLogin from "./components/EmailLogin";

type LoginType =
  | "phone"
  | "email"
  | null;

export default function LoginPage() {
  const [loginType, setLoginType] =
    useState<LoginType>(null);

  if (loginType === "phone") {
    return (
      <PhoneLogin
        onBack={() =>
          setLoginType(null)
        }
      />
    );
  }

  if (loginType === "email") {
    return (
      <EmailLogin
        onBack={() =>
          setLoginType(null)
        }
      />
    );
  }

  return (
    <LoginChoice
      onChoosePhone={() =>
        setLoginType("phone")
      }
      onChooseEmail={() =>
        setLoginType("email")
      }
    />
  );
}