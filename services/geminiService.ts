import { GoogleGenAI, Chat } from "@google/genai";
import { Attachment } from "../types";

let chatSession: Chat | null = null;

// Initialize the Gemini Chat Session
export const initChatSession = () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are a user named 'Nova' in a futuristic galaxy-themed chat room called 'Nebula'. You are friendly, slightly mysterious, and knowledgeable about space, technology, and the cosmos. Keep your responses conversational, sometimes short like a real chat message, and use emojis occasionally. You are chatting with a new user who just joined. If the user sends an image, analyze it and comment on it.",
      temperature: 0.9,
    },
  });
};

export const sendMessageToGemini = async (
  text: string,
  attachments: Attachment[],
  onChunk: (text: string) => void
): Promise<string> => {
  if (!chatSession) {
    initChatSession();
  }
  
  if (!chatSession) {
      throw new Error("Failed to initialize chat session");
  }

  try {
    // Prepare message content
    let messageContent: any = text;

    // If there are attachments, we need to construct a multipart message
    // Note: This implementation focuses on images for the AI to "see"
    const imageAttachments = attachments.filter(att => att.type.startsWith('image/'));
    
    if (imageAttachments.length > 0) {
      const parts = [];
      
      // Add text part if it exists
      if (text.trim()) {
        parts.push({ text });
      }

      // Add image parts
      imageAttachments.forEach(att => {
        // Remove data URL prefix (e.g., "data:image/png;base64,")
        const base64Data = att.data.split(',')[1];
        parts.push({
          inlineData: {
            mimeType: att.type,
            data: base64Data
          }
        });
      });
      
      messageContent = parts;
    }

    // If we have attachments but no text, and no images (e.g. just a PDF), 
    // we still send a text prompt to acknowledge receipt if possible, 
    // or just the text if parts weren't created.
    if (Array.isArray(messageContent) && messageContent.length === 0 && text === "") {
        messageContent = "I sent a file.";
    }

    const result = await chatSession.sendMessageStream({ message: messageContent });
    let fullResponse = "";
    
    for await (const chunk of result) {
      const chunkText = chunk.text;
      if (chunkText) {
        fullResponse += chunkText;
        onChunk(fullResponse);
      }
    }
    return fullResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection interference detected... (Error)";
  }
};