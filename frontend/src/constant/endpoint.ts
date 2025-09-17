export const baseURL = "https://aione.klinik-x.de/backend";

export const login = "/login";

export const signup = "/signup";

export const selectTemplate = "/healthcare/select_template";

export const generateHooks = "/healthcare/generate_hooks";

export const selectHook = "/healthcare/select_hook";

export const generatePostStream = "/healthcare/generate_linkedin_post/stream";

export const availableTemplates = "/healthcare/available_templates";

// Saved posts endpoints
export const getSavedPosts = "/healthcare/posts"; // GET with ID param
export const saveDraftPost = "/healthcare/posts/save";
export const updateSavedPost = "/healthcare/posts";
export const deleteSavedPost = "/healthcare/posts";

export const forgotPassword = "/forgot-password";

export const resetPassword = "/reset-password";

export const changePassword = "/change-password";

export const verifyToken = "/verify-token";

export const generateOtp = "/generate-otp";

export const verifyOtp = "/verify-otp";

// Onboarding profile endpoints
export const saveUserProfile = "/user-profile"; // POST
export const getUserProfile = "/user-profile"; // GET
