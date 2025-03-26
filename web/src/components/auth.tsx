"use client";

import React, { useEffect } from "react";
import { usePlaygroundState } from "@/hooks/use-playground-state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ellipsisMiddle } from "@/lib/utils";
import { KeyRound, CheckCircle2, ShieldCheck } from "lucide-react";

const AuthFormSchema = z.object({
  openaiAPIKey: z.string().min(1, { message: "API key is required" }),
});

export function Auth() {
  const { pgState, dispatch, showAuthDialog, setShowAuthDialog } =
    usePlaygroundState();

  const onLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch({ type: "SET_API_KEY", payload: null });
    setShowAuthDialog(true);
  };

  return (
    <div>
      {pgState.openaiAPIKey ? (
        <div className="text-xs flex gap-2 items-center">
          <span className="text-green-600 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span className="font-medium">API Connected</span>
          </span>
          <div className="py-1 px-2 rounded-md bg-gray-100 text-gray-600 border border-gray-200">
            {ellipsisMiddle(pgState.openaiAPIKey, 4, 4)}
          </div>
          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 h-6 px-2" onClick={onLogout}>
            Change
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowAuthDialog(true)}
          className="border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          <KeyRound className="h-3.5 w-3.5 mr-2" />
          Connect API Key
        </Button>
      )}
      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onAuthComplete={() => setShowAuthDialog(false)}
      />
    </div>
  );
}

export function AuthDialog({
  open,
  onOpenChange,
  onAuthComplete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthComplete: () => void;
}) {
  const { pgState, dispatch } = usePlaygroundState();
  const form = useForm<z.infer<typeof AuthFormSchema>>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      openaiAPIKey: pgState.openaiAPIKey || "",
    },
  });

  // Add this useEffect hook to watch for changes in pgState.openaiAPIKey
  useEffect(() => {
    form.setValue("openaiAPIKey", pgState.openaiAPIKey || "");
  }, [pgState.openaiAPIKey, form]);

  function onSubmit(values: z.infer<typeof AuthFormSchema>) {
    dispatch({ type: "SET_API_KEY", payload: values.openaiAPIKey || null });
    onOpenChange(false);
    onAuthComplete();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md p-6 rounded-lg overflow-hidden max-h-[90vh] flex flex-col"
        isModal={true}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <DialogHeader className="gap-2">
              <DialogTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-blue-600" />
                <span>Connect your OpenAI API Key</span>
              </DialogTitle>
              <DialogDescription>
                Required to access the AI interviewer functionality
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="openaiAPIKey"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-2">
                    <FormLabel className="font-semibold text-sm whitespace-nowrap">
                      OpenAI API Key
                    </FormLabel>
                    <div className="flex gap-2 w-full">
                      <FormControl className="w-full">
                        <Input
                          className="w-full font-mono text-sm"
                          placeholder="sk-..."
                          {...field}
                        />
                      </FormControl>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        Connect
                      </Button>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-xs py-2 flex items-center gap-2 text-gray-500 bg-gray-50 p-3 rounded-md">
              <ShieldCheck className="h-4 w-4 flex-shrink-0 text-blue-600" />
              <span>Your API key is securely stored only in your browser's local storage and never sent to our servers</span>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
