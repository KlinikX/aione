"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { setToken } from "@/utils/cookies";
import { apiInstance } from "@/services";
import { PasswordInput } from "@/components/ui/password-input";
import { changePassword } from "@/constant/endpoint";
import { useUser } from "@/context/UserProvider";

// Password change form schema
const passwordValidationRegex = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
);

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(passwordValidationRegex, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
    }),
});

type PasswordChangeForm = z.infer<typeof passwordChangeSchema>;

export default function SettingsPage() {
  const { userState, setUserState } = useUser();
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [isDeletingImage, setIsDeletingImage] = useState<boolean>(false);
  // Initialize password change form
  const passwordForm = useForm<PasswordChangeForm>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const handlePasswordChange = async (data: PasswordChangeForm) => {
    try {
      setIsChangingPassword(true);
      const response = await apiInstance.post(changePassword, {
        old_password: data.currentPassword,
        new_password: data.newPassword,
      });
      console.log(response.data);
      toast.success("Password changed successfully");

      setToken(response.data.bearer_token);
      passwordForm.reset();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Enforce 1MB max file size with a clear message
    const MAX_BYTES = 1 * 1024 * 1024; // 1MB
    if (file.size > MAX_BYTES) {
      toast.error("Image is too large. Please upload an image within 1 MB.");
      return;
    }

    // Prepare multipart/form-data
    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      setIsUploadingImage(true);
      const response = await apiInstance.post(
        "/upload-profile-picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUserState({
        ...userState,
        profilePicture: response?.data?.profile_picture_url,
      });

      toast.success("Profile picture uploaded successfully");
    } catch (error: any) {
      console.error(error);
      // Fallback error with size-specific hint if server rejects large payloads
      const serverMessage = error?.response?.data?.message;
      const status = error?.response?.status;
      if (status === 413 || /size|large|too\s*big/i.test(serverMessage || "")) {
        toast.error("Image is too large. Please upload an image within 1 MB.");
      } else {
        toast.error(serverMessage || "Failed to upload profile picture");
      }
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      setIsDeletingImage(true);
      await apiInstance.delete("/delete-profile-picture");
      setUserState({
        ...userState,
        profilePicture: undefined,
      });
      toast.success("Profile picture removed");
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to remove profile picture"
      );
    } finally {
      setIsDeletingImage(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-3 sm:p-6 min-h-screen bg-white text-gray-900 dark:bg-[#18181b] dark:text-gray-100 transition-colors">
      <div className="text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight dark:text-white">
          Settings
        </h2>
        <p className="text-sm text-muted-foreground dark:text-gray-400">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="flex justify-center w-full">
        <Tabs
          defaultValue="account"
          className="w-full sm:w-[400px] md:w-[480px] lg:w-[520px]"
        >
          <div className="flex justify-center">
            <TabsList className="mb-5 dark:bg-[#232326] dark:border-[#232326] dark:text-gray-100">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="account">
            <Card className="dark:bg-[#232326] dark:border-[#232326]">
              <CardHeader className="pb-4">
                <CardTitle className="dark:text-white text-center text-lg sm:text-xl">
                  Account Settings
                </CardTitle>
                <CardDescription className="dark:text-gray-400 text-center text-xs sm:text-sm">
                  Update your account information and email preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 px-3 sm:px-5">
                <div className="flex flex-col items-center space-y-3 mb-5 w-auto">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 relative">
                    {userState?.profilePicture ? (
                      <Image
                        src={userState?.profilePicture}
                        alt="Profile"
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-gray-400 dark:text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/jpeg, image/jpg, image/png, image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="profile-upload"
                    />
                    <Button
                      onClick={() =>
                        document.getElementById("profile-upload")?.click()
                      }
                      className="cursor-pointer px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
                      isLoading={isUploadingImage}
                    >
                      {userState?.profilePicture ? "Edit" : "Upload"}
                    </Button>
                    {userState?.profilePicture && (
                      <Button
                        onClick={handleDeleteImage}
                        variant="destructive"
                        className="text-sm px-3 py-1 dark:bg-red-600 dark:hover:bg-red-700"
                        isLoading={isDeletingImage}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-3 w-auto">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-sm dark:text-gray-200">
                      Name
                    </Label>
                    <Input
                      id="name"
                      defaultValue={userState?.name}
                      disabled={true}
                      className="w-full h-9 text-sm"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-sm dark:text-gray-200">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={userState?.email}
                      disabled={true}
                      className="w-full h-9 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium dark:text-gray-200 text-center sm:text-left">
                    Change Password
                  </h4>
                  <Form {...passwordForm}>
                    <form
                      onSubmit={passwordForm.handleSubmit(handlePasswordChange)}
                      className="space-y-3 w-auto"
                    >
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm dark:text-gray-200">
                              Current Password
                            </FormLabel>
                            <FormControl>
                              <PasswordInput {...field} className="w-full h-9 text-sm" />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm dark:text-gray-200">
                              New Password
                            </FormLabel>
                            <FormControl>
                              <PasswordInput {...field} className="w-full h-9 text-sm" />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-center pt-1">
                        <Button
                          type="submit"
                          disabled={isChangingPassword}
                          isLoading={isChangingPassword}
                          className="text-sm h-9 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
                        >
                          Change Password
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card className="dark:bg-[#232326] dark:border-[#232326]">
              <CardHeader className="pb-4">
                <CardTitle className="dark:text-white text-lg sm:text-xl">
                  Billing Information
                </CardTitle>
                <CardDescription className="dark:text-gray-400 text-xs sm:text-sm">
                  Manage your billing information and view your subscription.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-3 sm:px-5">
                <div className="rounded-lg border p-3 dark:bg-[#232326] dark:border-[#232326]">
                  <div className="space-y-1">
                    <h4 className="text-xs font-medium dark:text-gray-200">
                      Current Plan
                    </h4>
                    <p className="text-xl font-bold dark:text-white">
                      Pro Plan
                    </p>
                    <p className="text-xs text-muted-foreground dark:text-gray-400">
                      $29/month
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-medium dark:text-gray-200">
                    Payment Method
                  </h4>
                  <div className="flex items-center space-x-3">
                    <div className="rounded-md border p-2 dark:bg-[#232326] dark:border-[#232326]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <line x1="2" x2="22" y1="10" y2="10" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium dark:text-gray-200">
                        Visa ending in 4242
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-gray-400">
                        Expires 12/24
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs dark:bg-[#232326] dark:border-gray-600 dark:text-gray-200 dark:hover:bg-[#2a2a2e]"
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 pb-4 flex justify-center sm:justify-end gap-2">
                <Button
                  variant="outline"
                  className="h-9 text-xs dark:bg-[#232326] dark:border-gray-600 dark:text-gray-200 dark:hover:bg-[#2a2a2e]"
                >
                  View History
                </Button>
                <Button className="h-9 text-xs dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700">
                  Update Plan
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
