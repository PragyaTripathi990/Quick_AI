import User from '../modles/user.model.js';
import geminiResponse from '../gemini.js';
import moment from "moment";



export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch(errors) {
        console.error("Get current user error:", errors);
        return res.status(500).json({ message: "Server error" });
    }
}

export const updateUser = async (req, res) => {
    try {
        const userId = req.userId;
        const { assistantName, imageUrl } = req.body;
        
        const updates = {};
        
        // Update assistant name if provided
        if (assistantName) {
            updates.assistantName = assistantName;
        }
        
        // Handle image upload or URL
        if (req.file) {
            // If file was uploaded, save the file path
            updates.assistantImage = req.file.filename;
        } else if (imageUrl) {
            // If predefined image was selected
            updates.assistantImage = imageUrl;
        }
        
        const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch(errors) {
        console.error("Update user error:", errors);
        return res.status(500).json({ message: "Server error" });
    }
}

export const askToAssistant = async (req, res) => {
    try {
        const { command } = req.body;
        const userId = req.userId;

        console.log("Ask to assistant called with command:", command);
        console.log("User ID:", userId);

        // Get user data to pass assistant name and user name
        const user = await User.findById(userId).select('name assistantName');
        if (!user) {
            console.error("User not found:", userId);
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User found:", user.name, "Assistant:", user.assistantName);

        const response = await geminiResponse(command, user.assistantName, user.name);
        console.log("Gemini response received:", response);

        // Parse the JSON response from Gemini
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(response);
        } catch (parseError) {
            console.error("JSON parse error:", parseError);
            console.error("Raw response:", response);
            // Fallback response if JSON parsing fails
            parsedResponse = {
                type: "general",
                userInput: command,
                response: "I understand your request, but I'm having trouble processing it right now."
            };
        }

        return res.status(200).json(parsedResponse);
    } catch(errors) {
        console.error("Ask to assistant error:", errors);
        return res.status(500).json({
            type: "general",
            userInput: req.body.command || "",
            response: "Sorry, I encountered an error. Please try again."
        });
    }
}

