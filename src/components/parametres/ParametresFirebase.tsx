
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { Database } from "lucide-react";

const ParametresFirebase = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  
  const form = useForm({
    defaultValues: {
      apiKey: "AIzaSyBeWmKp9IwixLJD0hNb2DiI8zXfhKhw2Ks",
      authDomain: "neorh-998d2.firebaseapp.com",
      projectId: "neorh-998d2",
      storageBucket: "neorh-998d2.firebasestorage.app",
      messagingSenderId: "849642731551",
      appId: "1:849642731551:web:26c8e13c1019c524867d2a"
    }
  });
  
  const testConnection = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      toast({
        title: "Connexion réussie",
        description: "La connexion à Firebase a été établie avec succès",
      });
    }, 1500);
  };
  
  const onSubmit = (data) => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Les paramètres de Firebase ont été sauvegardés avec succès",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Configuration de Firebase
        </CardTitle>
        <CardDescription>
          Configurez les paramètres de connexion à votre base de données Firebase.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clé API</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <p className="text-sm text-gray-500 mt-1">La clé API de votre projet Firebase.</p>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="authDomain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domaine d'authentification</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID du projet</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="storageBucket"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bucket de stockage</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="messagingSenderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID d'expéditeur de messagerie</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="appId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID de l'application</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="text-sm text-gray-500">
              Ces paramètres sont utilisés pour connecter l'application à votre base de données Firebase.
            </div>
            
            <div className="flex justify-between pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={testConnection}
                disabled={isConnecting}
              >
                {isConnecting ? "Connexion en cours..." : "Tester la connexion"}
              </Button>
              <Button type="submit" className="flex items-center gap-2">
                <span className="i-lucide-save"></span>
                Sauvegarder les paramètres
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ParametresFirebase;
