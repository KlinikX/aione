
export default function VoicePromptEmptyState({
  title = "Start with your voice",
  description = "Tap the mic and speak your topic. Our AI will do the rest!",
  children,
  isRecording = false,
  transcript = "",
}: {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  isRecording?: boolean;
  transcript?: string;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative w-full min-h-[40vh] px-4">
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="w-[70vw] max-w-xl h-48 md:h-64 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-400/10 rounded-3xl blur-2xl" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 drop-shadow-lg text-gray-900 dark:text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-400 bg-clip-text text-transparent">
        {title}
      </h2>

      <p className="text-gray-600 dark:text-gray-300 text-center max-w-md mb-8">
        {description}
      </p>

      <div className="relative">{children}</div>

      <div className="mt-6 bg-white/80 dark:bg-[#232347]/90 border border-indigo-100 dark:border-indigo-900/40 rounded-xl px-6 py-3 shadow-md text-center max-w-md mx-auto backdrop-blur-sm">
        <span className="text-sm text-gray-700 dark:text-gray-200">
          {isRecording ? "Listening:" : "Try saying:"}
        </span>
        <div
          className={`mt-1 text-indigo-600 dark:text-indigo-300 font-semibold min-h-[1.5rem] ${
            isRecording && transcript ? "animate-pulse" : ""
          }`}
        >
          {isRecording ? (
            transcript ? `"${transcript}"` : "🎤 Listening..."
          ) : (
            '"How can doctors avoid burnout?"'
          )}
        </div>
      </div>
    </div>
  );
}