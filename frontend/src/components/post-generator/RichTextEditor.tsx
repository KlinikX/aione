"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import {
  Bold, Italic, Underline, Link, Image, Video, Smile, List,
  ListOrdered, AlignLeft, AlignCenter, AlignRight
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { emojis } from "@/constant/emoji";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [initialLoad, setInitialLoad] = useState(true);
  const isUserEditing = useRef(false);
  const savedSelection = useRef<Range | null>(null);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    // Only set the initial HTML content once when the component mounts
    if (editorRef.current && initialLoad && value) {
      editorRef.current.innerHTML = value;
      setInitialLoad(false);
    }
  }, [value, initialLoad]);

  // This effect handles updates from parent without affecting cursor
  useEffect(() => {
    // Don't update if user is actively editing to avoid cursor jumps
    if (editorRef.current && !isUserEditing.current && !initialLoad) {
      const currentContent = editorRef.current.innerHTML;

      // Only update if there's a significant difference from parent
      if (value !== currentContent &&
        value.replace(/\s+/g, '') !== currentContent.replace(/\s+/g, '')) {

        // Save selection
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);
        const savedRange = range ? { startOffset: range.startOffset, endOffset: range.endOffset } : null;

        // Update content
        editorRef.current.innerHTML = value;

        // Restore selection if possible
        if (savedRange && selection) {
          try {
            const newRange = document.createRange();
            newRange.setStart(selection.anchorNode!, savedRange.startOffset);
            newRange.setEnd(selection.focusNode!, savedRange.endOffset);
            selection.removeAllRanges();
            selection.addRange(newRange);
          } catch (e) {
            // If restoring selection fails, it's ok - better than a crash
            console.log("Could not restore selection", e);
          }
        }
      }
    }
  }, [value, initialLoad]);

  // Add event listeners for handling media deletion
  useEffect(() => {
    const handleMediaElements = () => {
      if (editorRef.current) {
        // Find all images and video containers
        const images = editorRef.current.querySelectorAll('.editor-image');
        const videos = editorRef.current.querySelectorAll('.video-embed');

        // Add deletion capabilities to images
        images.forEach(img => {
          // Skip if already processed
          if (img.classList.contains('deletion-enabled')) return;

          img.classList.add('deletion-enabled');

          // Add container around the image for delete button
          const wrapper = document.createElement('div');
          wrapper.className = 'media-wrapper';
          // Allow normal editing inside
          wrapper.contentEditable = 'true';
          img.parentNode?.insertBefore(wrapper, img);
          wrapper.appendChild(img);

          // Create delete button
          const deleteBtn = document.createElement('button');
          deleteBtn.className = 'media-delete-btn';
          deleteBtn.innerHTML = '×';
          deleteBtn.title = 'Delete image';
          deleteBtn.contentEditable = 'false'; // Prevent editing of delete button
          deleteBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            wrapper.remove();
            onChange(editorRef.current!.innerHTML);
          };
          wrapper.appendChild(deleteBtn);
        });

        // Add deletion capabilities to videos
        videos.forEach(video => {
          // Skip if already processed
          if (video.classList.contains('deletion-enabled')) return;

          video.classList.add('deletion-enabled');

          // Create delete button
          const deleteBtn = document.createElement('button');
          deleteBtn.className = 'media-delete-btn';
          deleteBtn.innerHTML = '×';
          deleteBtn.title = 'Delete video';
          deleteBtn.contentEditable = 'false'; // Prevent editing of delete button
          deleteBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            video.remove();
            onChange(editorRef.current!.innerHTML);
          };
          video.appendChild(deleteBtn);
        });
      }
    };

    // Set up mutation observer to watch for new media elements
    if (editorRef.current) {
      const observer = new MutationObserver(handleMediaElements);
      observer.observe(editorRef.current, {
        childList: true,
        subtree: true
      });

      // Initial setup for existing elements
      handleMediaElements();

      return () => observer.disconnect();
    }
  }, [onChange]);

  const execCommand = useCallback((command: string, value?: string) => {
    if (editorRef.current) {
      // Focus the editor first to ensure commands work properly
      editorRef.current.focus();

      // Special handling for list commands
      if (command === 'insertOrderedList' || command === 'insertUnorderedList') {
        // Save selection
        const selection = window.getSelection();
        const hasSelection = selection && selection.rangeCount > 0;

        // If no text is selected, try to apply to the current line/paragraph
        if (hasSelection && selection!.toString().trim() === '') {
          // Find the current paragraph or parent block element
          const range = selection!.getRangeAt(0);
          let currentNode: Node | null = range.startContainer;

          // Navigate up to find block element (p, div, etc.)
          while (currentNode &&
            (currentNode.nodeType !== Node.ELEMENT_NODE ||
              !['P', 'DIV', 'LI', 'BLOCKQUOTE'].includes((currentNode as Element).tagName))) {
            currentNode = currentNode.parentNode;
          }

          // If found a proper block element, select it entirely
          if (currentNode && currentNode.nodeType === Node.ELEMENT_NODE) {
            try {
              range.selectNodeContents(currentNode);
              selection!.removeAllRanges();
              selection!.addRange(range);
            } catch (e) {
              console.log("Could not select node contents", e);
            }
          }
        }
      }

      // Execute the command
      document.execCommand(command, false, value);

      // Get the HTML with enhanced emojis
      const currentHtml = editorRef.current.innerHTML;
      onChange(currentHtml);
    }
  }, [onChange]);

  const handleBold = () => execCommand('bold');
  const handleItalic = () => execCommand('italic');
  const handleUnderline = () => execCommand('underline');
  const handleOrderedList = () => execCommand('insertOrderedList');
  const handleUnorderedList = () => execCommand('insertUnorderedList');
  const handleAlignLeft = () => execCommand('justifyLeft');
  const handleAlignCenter = () => execCommand('justifyCenter');
  const handleAlignRight = () => execCommand('justifyRight');

  const handleLink = () => {
    if (linkUrl) {
      if (savedSelection.current) {
        // Restore the selection
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(savedSelection.current);
        }

        // If there's no selected text and link text is provided, insert the link text
        if (selection?.toString().trim() === '' && linkText) {
          const linkElement = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
          document.execCommand('insertHTML', false, linkElement);
        } else {
          // Otherwise, use the selected text with the createLink command
          document.execCommand('createLink', false, linkUrl);

          // Set target="_blank" on all links to open in new tab
          if (editorRef.current) {
            const linkElements = editorRef.current.querySelectorAll('a[href="' + linkUrl + '"]');
            linkElements.forEach(link => {
              link.setAttribute('target', '_blank');
              link.setAttribute('rel', 'noopener noreferrer');
            });
          }
        }
      } else {
        // If no selection was saved, insert a new link with the provided text
        if (linkText) {
          const linkElement = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
          if (editorRef.current) {
            editorRef.current.focus();
            document.execCommand('insertHTML', false, linkElement);
          }
        }
      }

      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }

      // Reset state
      setLinkUrl("");
      setLinkText("");
      setShowLinkInput(false);
      savedSelection.current = null;
    }
  };

  const handleLinkButtonClick = () => {
    // Save the current selection before opening the popover
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelection.current = selection.getRangeAt(0).cloneRange();

      // If text is selected, use it as the default link text
      if (selection.toString().trim() !== '') {
        setLinkText(selection.toString());
      }
    }

    setShowLinkInput(true);
  };

  const handleImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          // Make image properly work with surrounding content
          const img = `<img src="${event.target?.result}" alt="Uploaded image" class="editor-image" />`;
          if (editorRef.current) {
            editorRef.current.focus();

            // Insert a space after the image to allow proper editing
            const imgWithSpace = img + '&#8203;';
            document.execCommand('insertHTML', false, imgWithSpace);
            onChange(editorRef.current.innerHTML);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleVideoButtonClick = () => {
    // Save the current selection before opening the popover
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelection.current = selection.getRangeAt(0).cloneRange();
    }

    setShowVideoInput(true);
  };

  const handleVideo = () => {
    if (videoUrl && editorRef.current) {
      try {
        // Extract video ID for YouTube and Vimeo URLs
        let finalVideoUrl = videoUrl;

        // Handle YouTube links
        if (videoUrl.includes('youtube.com/watch') || videoUrl.includes('youtu.be')) {
          const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
          const match = videoUrl.match(youtubeRegex);
          if (match && match[1]) {
            finalVideoUrl = `https://www.youtube.com/embed/${match[1]}`;
          }
        }
        // Handle Vimeo links
        else if (videoUrl.includes('vimeo.com')) {
          const vimeoRegex = /vimeo\.com\/(\d+)/;
          const match = videoUrl.match(vimeoRegex);
          if (match && match[1]) {
            finalVideoUrl = `https://player.vimeo.com/video/${match[1]}`;
          }
        }

        const videoEmbed = `<div class="video-embed" contenteditable="false">
          <iframe 
            src="${finalVideoUrl}" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
            class="editor-video">
          </iframe>
        </div>`;

        // Restore selection before inserting
        editorRef.current.focus();

        if (savedSelection.current) {
          const selection = window.getSelection();
          if (selection) {
            // Restore the saved selection
            selection.removeAllRanges();
            selection.addRange(savedSelection.current);
          }
        }

        // Insert the video at the current selection
        document.execCommand('insertHTML', false, videoEmbed);
        onChange(editorRef.current.innerHTML);

        // Reset state
        setVideoUrl("");
        setShowVideoInput(false);
        savedSelection.current = null;
      } catch (error) {
        toast.error("Failed to embed video. Please check the URL.");
        console.error(error);
      }
    }
  };

  const handleEmoji = (emoji: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      // Insert the emoji wrapped in a styled span
      const enhancedEmoji = `<span class="emoji" style="font-size: 1.2em;">${emoji}</span>`;
      document.execCommand('insertHTML', false, enhancedEmoji);
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      isUserEditing.current = true;
      const currentHtml = editorRef.current.innerHTML;
      onChange(currentHtml);
      // Reset after a short delay
      setTimeout(() => {
        isUserEditing.current = false;
      }, 100);
    }
  };

  const handleEditorFocus = () => {
    isUserEditing.current = true;
  };

  const handleEditorBlur = () => {
    isUserEditing.current = false;
    handleEditorChange();
  };

  return (
    <div className="rich-text-editor border rounded-lg overflow-hidden dark:border-neutral-700 shadow-sm">
      <div className="toolbar flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50 dark:bg-neutral-900 dark:border-neutral-800">
        <Toggle aria-label="Toggle bold" pressed={false} onPressedChange={handleBold}>
          <Bold size={16} />
        </Toggle>
        <Toggle aria-label="Toggle italic" pressed={false} onPressedChange={handleItalic}>
          <Italic size={16} />
        </Toggle>
        <Toggle aria-label="Toggle underline" pressed={false} onPressedChange={handleUnderline}>
          <Underline size={16} />
        </Toggle>

        <div className="h-6 w-px bg-gray-300 dark:bg-neutral-700 mx-1"></div>

        <Toggle aria-label="Align left" pressed={false} onPressedChange={handleAlignLeft}>
          <AlignLeft size={16} />
        </Toggle>
        <Toggle aria-label="Align center" pressed={false} onPressedChange={handleAlignCenter}>
          <AlignCenter size={16} />
        </Toggle>
        <Toggle aria-label="Align right" pressed={false} onPressedChange={handleAlignRight}>
          <AlignRight size={16} />
        </Toggle>

        {/* <div className="h-6 w-px bg-gray-300 dark:bg-neutral-700 mx-1"></div>

        <Toggle aria-label="Ordered list" pressed={false} onPressedChange={handleOrderedList}>
          <ListOrdered size={16} />
        </Toggle>
        <Toggle aria-label="Unordered list" pressed={false} onPressedChange={handleUnorderedList}>
          <List size={16} />
        </Toggle> */}

        <div className="h-6 w-px bg-gray-300 dark:bg-neutral-700 mx-1"></div>

        <Popover open={showLinkInput} onOpenChange={(open) => {
          if (!open) {
            // Reset when closing without adding
            setLinkUrl("");
            setLinkText("");
            savedSelection.current = null;
          }
          setShowLinkInput(open);
        }}>
          <PopoverTrigger asChild>
            <Toggle
              aria-label="Add link"
              pressed={false}
              onPressedChange={handleLinkButtonClick}
            >
              <Link size={16} />
            </Toggle>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3">
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-sm mb-1 text-muted-foreground">Link Text</p>
                <Input
                  type="text"
                  placeholder="Text to display"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                />
              </div>
              <div>
                <p className="text-sm mb-1 text-muted-foreground">URL</p>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLink()}
                  />
                  <Button onClick={handleLink} size="sm">Add</Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Toggle aria-label="Add image" pressed={false} onPressedChange={handleImage}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image size={16} />
        </Toggle>

        <Popover open={showVideoInput} onOpenChange={(open) => {
          if (!open) {
            setVideoUrl("");
            savedSelection.current = null;
          }
          setShowVideoInput(open);
        }}>
          <PopoverTrigger asChild>
            <Toggle
              aria-label="Add video"
              pressed={false}
              onPressedChange={handleVideoButtonClick}
            >
              <Video size={16} />
            </Toggle>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3">
            <div className="flex flex-col gap-3">
              <p className="text-sm mb-1 text-muted-foreground">Enter video URL (YouTube, Vimeo, etc.)</p>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVideo()}
                />
                <Button onClick={handleVideo} size="sm">Add</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="h-6 w-px bg-gray-300 dark:bg-neutral-700 mx-1"></div>

        <Popover>
          <PopoverTrigger asChild>
            <Toggle aria-label="Add emoji">
              <Smile size={16} />
            </Toggle>
          </PopoverTrigger>
          <PopoverContent className="w-64 h-48 overflow-y-auto">
            <div className="grid grid-cols-8 gap-1">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  className="flex items-center justify-center w-7 h-7 text-lg hover:bg-gray-100 dark:hover:bg-neutral-800 rounded"
                  onClick={() => handleEmoji(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <style jsx global>{`
        .emoji {
          display: inline-block;
          font-size: 1.2em;
          vertical-align: middle;
          line-height: 1;
        }

        .editable-content p {
          margin-bottom: 1em;
        }

        .editable-content p:last-child {
          margin-bottom: 0;
        }

        .editable-content a {
          color: #0070f3;
          text-decoration: underline;
          cursor: pointer;
        }

        .editable-content a:hover {
          text-decoration: none;
        }

        .editor-image {
          max-width: 100%;
          margin: 10px 0;
          display: block;
        }

        .video-embed {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          overflow: hidden;
          max-width: 100%;
          margin: 10px 0;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
        }

        .editor-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        /* Media deletion styles */
        .media-wrapper {
          position: relative;
          display: inline-block;
          max-width: 100%;
          margin: 10px 0;
        }
        
        .media-delete-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          background-color: rgba(0, 0, 0, 0.6);
          color: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s;
          z-index: 10;
          line-height: 1;
          font-weight: bold;
        }
        
        .media-wrapper:hover .media-delete-btn,
        .video-embed:hover .media-delete-btn {
          opacity: 1;
        }
        
        .media-delete-btn:hover {
          background-color: rgba(220, 38, 38, 0.8);
        }

        /* Make videos selectable for keyboard deletion */
        .video-embed {
          user-select: all;
        }
      `}</style>

      <div
        ref={editorRef}
        className="editable-content p-4 min-h-[200px] focus:outline-none bg-white dark:bg-neutral-800 text-black dark:text-white"
        contentEditable
        onInput={handleEditorChange}
        onFocus={handleEditorFocus}
        onBlur={handleEditorBlur}
        style={{
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
          lineHeight: '1.5',
        }}
      />
    </div>
  );
}