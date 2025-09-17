import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import DevicePreview from "./post-generator/DevicePreview";
import { useEffect, useState } from "react";
import { Post } from "./post-generator/PostEditor";

interface PreviewModalProps {
    open: boolean;
    onClose: () => void;
    post: Post | any;
    isDarkMode: boolean;
}

function PreviewModal({ open, onClose, post, isDarkMode }: PreviewModalProps) {
    const [editedContent, setEditedContent] = useState("");
    const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">(
        "desktop"
    );

    useEffect(() => {
        setEditedContent(post?.content)
    }, [])

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className={`max-w-4xl p-2 md:p-8 max-h-[90vh] overflow-y-auto ${isDarkMode ? "bg-[#1B1F23] text-white" : "bg-white text-black"
                    }`}
            >
                <div
                    className={`linkedin-preview md:p-2 p-4 overflow-hidden transition-all duration-300 ${previewDevice === "mobile" ? "max-w-[350px]" : "max-w-full"
                        } mx-auto border rounded-lg shadow-sm dark:border-neutral-700`}
                    style={{
                        maxHeight: "75vh",
                        overflowY: "auto",
                    }}
                >
                    {/* Your preview UI */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-medium">Preview</h2>
                            <DevicePreview
                                currentDevice={previewDevice}
                                onChange={setPreviewDevice}
                            />
                        </div>

                        <div
                            className={`linkedin-preview overflow-hidden max-w-full mx-auto border rounded-lg shadow-sm ${isDarkMode ? "dark:border-neutral-700" : ""
                                }`}
                        >
                            <div
                                className={`p-4 ${isDarkMode ? "bg-[#1B1F23] text-white" : "bg-white text-black"
                                    }`}
                            >
                                <div key={post?.id} className="flex items-center mb-3">
                                    <Avatar className="w-10 h-10 mr-3">
                                        <AvatarImage src={post?.author?.profilePicture} alt={post?.author?.name} />
                                        <AvatarFallback>
                                            {post?.author?.name?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{post?.author?.name || "Your Name"}</div>
                                        <div
                                            className={`text-xs ${isDarkMode ? "text-neutral-400" : "text-gray-500"
                                                }`}
                                        >
                                            {post?.author?.position || "Your Position"}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="post-content text-sm"
                                    dangerouslySetInnerHTML={{ __html: editedContent }}
                                />

                            </div>
                            <div
                                className={`border-t p-3 flex justify-between ${isDarkMode
                                    ? "bg-neutral-900 border-neutral-800 text-neutral-400"
                                    : "bg-gray-50 border-gray-200 text-gray-500"
                                    }`}
                            >
                                <div className="flex gap-4 text-xs">
                                    <div>Like</div>
                                    <div>Comment</div>
                                    <div>Share</div>
                                </div>
                                <div className="text-xs">Send</div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}


export default PreviewModal