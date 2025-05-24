
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Navigate } from "react-router-dom";
import { showErrorToast } from "@/utils/toastUtils";
import LoginLogo from "@/components/auth/LoginLogo";
import LoginCard from "@/components/auth/LoginCard";
import LoginForm from "@/components/auth/LoginForm";

type LoginFormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const { signIn, isAuthenticated, error } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      navigate("/"); // Redirect to home page after successful login
    } catch (error) {
      showErrorToast("Échec de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <LoginLogo />
        <LoginCard>
          <LoginForm 
            onSubmit={onSubmit}
            isLoading={isLoading}
            error={error}
          />
        </LoginCard>
      </div>
    </div>
  );
};

export default Login;
