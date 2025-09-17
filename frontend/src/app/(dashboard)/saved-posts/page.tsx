"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { ArrowDown, Loader2, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PostEditor, { Post } from "@/components/post-generator/PostEditor";
import { apiInstance } from "@/services";
import {
  getSavedPosts,
  updateSavedPost,
  deleteSavedPost,
} from "@/constant/endpoint";
import { User } from "@/context/User";
import { useUser } from "@/context/UserProvider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PreviewModal from "@/components/PreviewModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SavedPostsPage() {
  const { toast } = useToast();
  const { theme } = useTheme();
  const { userState }: { userState: User | null } = useUser();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [fetchingPost, setFetchingPost] = useState(false);

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title?: string } | null>(null);

  const fetchSavedPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiInstance.get(getSavedPosts);
      setPosts(
        response.data.posts.map((post: any) => ({
          id: post._id,
          title: post?.generation_metadata?.hook,
          type: post?.generation_metadata?.template_name,
          content: post?.content,
          createdAt: post.created_at,
          author: {
            name: userState?.name || "Your Name",
            position: "Content Writer",
            profilePicture: userState?.profilePicture || "",
          },
        }))
      );
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch saved posts:", error);
      toast({
        title: "Error",
        description: "Failed to load saved posts",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [toast, userState?.name, userState?.profilePicture]);

  const fetchPostById = useCallback(
    async (postId: string) => {
      setFetchingPost(true);
      try {
        const response = await apiInstance.get(`${getSavedPosts}/${postId}`);
        setSelectedPost({
          id: response.data._id,
          title: response.data?.generation_metadata?.hook,
          type: response.data?.generation_metadata?.template_name,
          content: response.data?.content,
          createdAt: response.data?.created_at,
          author: {
            name: userState?.name || "Your Name",
            position: "Content Writer",
            profilePicture: userState?.profilePicture || "",
          },
        });
        setFetchingPost(false);
      } catch (error) {
        console.error("Failed to fetch post:", error);
        toast({
          title: "Error",
          description: "Failed to load post",
          variant: "destructive",
        });
        setFetchingPost(false);
      }
    },
    [toast, userState?.name, userState?.profilePicture]
  );

  const handlePostSave = useCallback(
    async (updatedPost: Post) => {
      try {
        await apiInstance.put(
          `${updateSavedPost}/${updatedPost.id}`,
          updatedPost
        );
        await fetchSavedPosts();
        toast({
          title: "Success",
          description: "Post updated successfully",
        });
        setSelectedPost(null);
      } catch (error) {
        console.error("Failed to update post:", error);
        toast({
          title: "Error",
          description: "Failed to update post",
          variant: "destructive",
        });
      }
    },
    [toast, fetchSavedPosts]
  );

  const handleDeletePost = useCallback(
    async (postId: string) => {
      try {
        await apiInstance.delete(`${deleteSavedPost}/${postId}`);
        await fetchSavedPosts();
        toast({
          title: "Success",
          description: "Post deleted successfully",
        });
      } catch (error) {
        console.error("Failed to delete post:", error);
        toast({
          title: "Error",
          description: "Failed to delete post",
          variant: "destructive",
        });
      }
    },
    [toast, fetchSavedPosts]
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  useEffect(() => {
    fetchSavedPosts();
  }, [fetchSavedPosts]);


  if (previewModalOpen) {
    return (
      <PreviewModal
        open={previewModalOpen}
        onClose={() => {
          setPreviewModalOpen(false);
          setSelectedPost(null);
        }}
        post={selectedPost}
        isDarkMode={theme === "dark"}
      />
    );
  }


  if (selectedPost) {
    return (
      <div className={cn(
        "min-h-screen flex flex-col",
        theme === "dark"
          ? "bg-[#18181b] text-gray-100"
          : "bg-gray-50 text-gray-900"
      )}
      >
        <div className="container max-w-5xl mx-auto p-4">
          <PostEditor
            post={selectedPost}
            onSave={handlePostSave}
            onCancel={() => setSelectedPost(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col",
        theme === "dark"
          ? "bg-[#18181b] text-gray-100"
          : "bg-gray-50 text-gray-900"
      )}
    >
      <div className="container max-w-5xl mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h1
              className={cn(
                "text-2xl font-bold",
                theme === "dark" && "text-gray-100"
              )}
            >
              Saved Posts
            </h1>
            <Button
              onClick={() => (window.location.href = "/generate-post")}
              className={cn("bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-medium")}
            >
              Create New Post
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2
                className={cn(
                  "h-8 w-8 animate-spin",
                  theme === "dark" ? "text-indigo-400" : "text-primary"
                )}
              />
            </div>
          ) : posts.length === 0 ? (
            <Card
              className={cn(
                "p-8 text-center",
                theme === "dark"
                  ? "bg-[#1B1F23]/80 border-neutral-700/50 shadow-lg"
                  : "bg-card shadow-sm"
              )}
            >
              <h3
                className={cn(
                  "text-lg font-medium mb-2",
                  theme === "dark" && "text-gray-100"
                )}
              >
                No saved posts yet
              </h3>
              <p
                className={cn(
                  "mb-4",
                  theme === "dark" ? "text-gray-400" : "text-muted-foreground"
                )}
              >
                Your saved posts will appear here once you create them.
              </p>
              <Button
                onClick={() => (window.location.href = "/generate-post")}
                className={cn(
                  theme === "dark"
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-indigo-500 hover:bg-indigo-600"
                )}
              >
                Create a New Post
              </Button>
            </Card>
          ) : (
            <AnimatePresence>
              <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {posts?.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                    className="h-full p-2"
                  >
                    <Card
                      className={cn(
                        "min-h-44 rounded-xl  p-6 cursor-pointer transition-all duration-200 flex flex-col",
                        theme === "dark"
                          ? "bg-[#1B1F23]/90 hover:bg-[#1B1F23] border-neutral-700/50 shadow-md hover:shadow-lg"
                          : "bg-card hover:bg-card/95 hover:shadow-md"
                      )}
                      onClick={() => fetchPostById(post.id)}
                    >
                      <div className="flex-grow">
                        <h3
                          className={cn(
                            "font-medium text-lg line-clamp-2",
                            theme === "dark" && "text-gray-100"
                          )}
                        >
                          {post.title}
                        </h3>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <span
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              post.type === "Standard"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-300"
                                : post.type === "Story"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-300"
                                  : post.type === "Facts"
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/70 dark:text-amber-300"
                                    : "bg-purple-100 text-purple-800 dark:bg-purple-900/70 dark:text-purple-300"
                            )}
                          >
                            {post.type}
                          </span>
                          <span
                            className={cn(
                              "text-xs",
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-muted-foreground"
                            )}
                          >
                            {formatDate(post?.createdAt || "")}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-white bg-indigo-600 hover:bg-indigo-700 hover:text-gray-100"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal size={18} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                fetchPostById(post.id);
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={async (e) => {
                                e.stopPropagation();
                                await fetchPostById(post.id);
                                setPreviewModalOpen(true);
                              }}
                              className="gap-2 cursor-pointer"
                            >
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer"
                            >
                              Publish
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteTarget({ id: post.id, title: post.title });
                                setDeleteDialogOpen(true);
                              }}
                              className="gap-2 cursor-pointer text-red-600 focus:text-red-700"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        {/* <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            theme === "dark"
                              ? "text-white bg-red-500 hover:text-red-600 hover:bg-red-300"
                              : "text-destructive bg-red-100 hover:text-destructive/90 hover:bg-destructive/40"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              confirm(
                                "Are you sure you want to delete this post?"
                              )
                            ) {
                              handleDeletePost(post.id);
                            }
                          }}
                        >
                          Delete
                        </Button> */}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {fetchingPost && (
            <div
              className={cn(
                "fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50",
                theme === "dark" ? "bg-black/60" : "bg-background/80"
              )}
            >
              <div
                className={cn(
                  "flex flex-col items-center gap-2 p-6 rounded-lg",
                  theme === "dark"
                    ? "bg-[#1B1F23]/90 shadow-xl"
                    : "bg-background/95 shadow-md"
                )}
              >
                <Loader2
                  className={cn(
                    "h-8 w-8 animate-spin",
                    theme === "dark" ? "text-indigo-400" : "text-primary"
                  )}
                />
                <p
                  className={cn(
                    "text-sm font-medium",
                    theme === "dark" && "text-gray-200"
                  )}
                >
                  Loading post...
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>



      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md dark:bg-[#232326] dark:text-gray-100 border border-gray-200/40 dark:border-[#2a2a35] shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Delete post?</DialogTitle>
            <DialogDescription className="text-sm dark:text-gray-400">
              This action cannot be undone. This will permanently delete
              {deleteTarget?.title ? (
                <>
                  {" "}
                  <span className="font-medium text-foreground dark:text-gray-200">“{deleteTarget.title}”</span>
                </>
              ) : (
                " this saved post"
              )}
              .
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="dark:bg-[#232326] dark:border-gray-600 dark:text-gray-200 dark:hover:bg-[#2a2a2e]"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (deleteTarget?.id) {
                  await handleDeletePost(deleteTarget.id);
                }
                setDeleteDialogOpen(false);
                setDeleteTarget(null);
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
