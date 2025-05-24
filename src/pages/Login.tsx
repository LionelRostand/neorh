
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Navigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, User, Shield } from "lucide-react";
import { showErrorToast } from "@/utils/toastUtils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const loginSchema = z.object({
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { signIn, isAuthenticated, error } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const adminForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@neotech-consulting.com",
      password: "Admin@123",
    },
  });

  const employeeForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

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
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="text-[#2ECC71] text-4xl">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 5.83L31.67 12.5V25.83L20 32.5L8.33 25.83V12.5L20 5.83Z" stroke="#2ECC71" strokeWidth="3" fill="#2ECC71" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-800">NEORH</span>
          </div>
        </div>
        
        <Card className="shadow-md border border-gray-200">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
            <CardDescription>
              Choisissez votre type de compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="admin" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Administrateur
                </TabsTrigger>
                <TabsTrigger value="employee" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Employé
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="admin">
                <Form {...adminForm}>
                  <form onSubmit={adminForm.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={adminForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email administrateur</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                {...field}
                                type="email"
                                className="pl-10"
                                placeholder="admin@neotech-consulting.com"
                                autoComplete="email"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={adminForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                className="pl-10"
                                placeholder="Votre mot de passe"
                                autoComplete="current-password"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                    
                    <Button
                      type="submit"
                      className="w-full bg-[#2ECC71] hover:bg-[#27AE60] text-white font-medium flex items-center justify-center py-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        "Connexion en cours..."
                      ) : (
                        <>
                          Se connecter
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="employee">
                <Form {...employeeForm}>
                  <form onSubmit={employeeForm.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={employeeForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email professionnel</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                {...field}
                                type="email"
                                className="pl-10"
                                placeholder="votre.email@entreprise.com"
                                autoComplete="email"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={employeeForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                className="pl-10"
                                placeholder="Votre mot de passe"
                                autoComplete="current-password"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                    
                    <Button
                      type="submit"
                      className="w-full bg-[#2ECC71] hover:bg-[#27AE60] text-white font-medium flex items-center justify-center py-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        "Connexion en cours..."
                      ) : (
                        <>
                          Se connecter
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
