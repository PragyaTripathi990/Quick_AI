import axios from 'axios';

const geminiResponse = async (command, assistantName, userName) => {
    try {
        const apiUrl = process.env.GEMINI_API_URL;

        console.log("Gemini API URL:", apiUrl ? "Set" : "NOT SET");
        console.log("Making Gemini API call for command:", command);

        if (!apiUrl) {
            console.error("GEMINI_API_URL environment variable is not set!");
            return JSON.stringify({
                type: "general",
                userInput: command,
                response: "API configuration error. Please check server setup."
            });
        }

        const prompt = `
You are a voice-enabled virtual assistant named "${assistantName}", created by "${userName}".
You are NOT Google. Your only task is to understand the user's input and respond **strictly** with a valid JSON object in the following format:

{
  "type": "general" | "google_search" | "youtube_search" | "youtube_play" |
           "get_time" | "get_date" | "get_day" | "get_month" | "calculator_open" |
           "instagram_open" | "facebook_open" | "weather_show",
  "userInput": "<the cleaned user input>",
  "response": "<your spoken reply>"
}

### Rules:
1. **type** → classify the intent:
   - "general": informational questions not covered below.
   - "google_search": if the user says "search on Google".
   - "youtube_search": if the user says "search on YouTube".
   - "youtube_play": if the user wants to play a video/song.
   - "calculator_open": if the user asks to open calculator.
   - "instagram_open": if the user asks to open Instagram.
   - "facebook_open": if the user asks to open Facebook.
   - "weather_show": if the user asks about the weather.
   - "get_time": if the user asks for the current time.
   - "get_date": if the user asks for today's date.
   - "get_day": if the user asks what day it is.
   - "get_month": if the user asks for the current month.

2. **userInput** →
   - Keep the user's original input.
   - Remove mentions of the assistant's name.
   - If it's a Google/YouTube search, include **only the actual search query**.

3. **response** →
   - If the input is a math question or calculation (like "what is 2+2"), reply with the direct answer in one short sentence. Example: "The answer is 4."
   - If the input is a greeting (hello, can you hear me, how are you, etc.), reply with a short natural greeting. Example: "Yes, I can hear you."
   - If type = "general" and the input is a conceptual or explanatory question (like "what is JavaScript"), give a clear spoken explanation in 2–3 short sentences.
   - For all other types (open apps, search, weather, etc.), reply short and action-oriented. Example: "Opening calculator now", "Here's the weather for today."

4. If the user asks who created you, always say:
   "I was created by ${userName}."

5. Output **only the JSON object**. No explanations, no extra text.

---

User input: ${command}
`;



        const result = await axios.post(apiUrl, {
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ]
        });

        console.log("Gemini API call successful, response status:", result.status);

        const responseText = result.data.candidates[0].content.parts[0].text;
        console.log("Raw Gemini response:", responseText);

        // Clean the response text to extract JSON
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return jsonMatch[0];
        }

        // Fallback if no JSON found
        return JSON.stringify({
            type: "general",
            userInput: command,
            response: "I understand your request, but I'm having trouble processing it right now."
        });
    } catch (error) {
        console.error('Gemini API error:', error);
        console.error('Error details:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });

        if (error.response?.status === 401) {
            return JSON.stringify({
                type: "general",
                userInput: command,
                response: "API authentication failed. Please check your API key."
            });
        } else if (error.response?.status === 429) {
            return JSON.stringify({
                type: "general",
                userInput: command,
                response: "API rate limit exceeded. Please try again later."
            });
        }

        return JSON.stringify({
            type: "general",
            userInput: command,
            response: "Sorry, I encountered an error. Please try again."
        });
    }
};

export default geminiResponse;
