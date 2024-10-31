import { ClothingItem } from "../types/ClothingItem";
import { categories } from "../data/categories";
import { colors as colorOptions, seasons, occasions } from "../data/options";
import * as FileSystem from "expo-file-system";

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_KEY;

export const categorizeClothing = async (imageUri: string): Promise<Partial<ClothingItem>> => {
  try {
    console.debug("[Categorization Service] Request Initiated Time:", new Date().toISOString());
    // Read the image file and convert it to Base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });
    const base64Uri = `data:image/jpeg;base64,${base64}`;

    // Prepare the system prompt
    const categoriesAndSubcategories = Object.entries(categories)
      .map(([category, subcategories]) => {
        const subcategoriesList = subcategories.join(", ");
        return `${category}: ${subcategoriesList}`;
      })
      .join("; ");
    const colorList = colorOptions.join(", ");
    const seasonList = seasons.join(", ");
    const occasionList = occasions.join(", ");

    const systemPrompt = `You are an AI assistant that categorizes clothing items based on images.
    The possible categories and their subcategories are: ${categoriesAndSubcategories}.
    The possible colors are: ${colorList}.
    The possible seasons are: ${seasonList}.
    The possible occasions are: ${occasionList}.
    Please provide the most appropriate category, subcategory, colors, seasons, and occasions for the given clothing item.
    The category and subcategory should be selected from the list of categories and subcategories provided.
    Ensure that the subcategory corresponds to the correct category.
    If more than one color applies, please provide the top 5 colors in the order of decreasing prominence.
    More than one season or occasion may apply, so please provide all that are relevant.`;

    const requestBody = {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please categorize this clothing item based on the image.",
            },
            {
              type: "image_url",
              image_url: {
                url: base64Uri,
                detail: "low",
              },
            },
          ],
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "clothing_categorization",
          strict: true,
          schema: {
            type: "object",
            properties: {
              category: { type: "string" },
              subcategory: { type: "string" },
              color: { type: "array", items: { type: "string" } },
              season: { type: "array", items: { type: "string" } },
              occasion: { type: "array", items: { type: "string" } },
            },
            required: ["category", "subcategory", "color", "season", "occasion"],
            additionalProperties: false,
          },
        },
      },
    };

    // Submit the request
    console.debug("[Categorization Service] Request Submitted Time:", new Date().toISOString());
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const responseData = await response.json();

    // Extract the AI's response
    console.debug("[Categorization Service] Response Received Time:", new Date().toISOString());
    const aiContent = responseData.choices[0].message.content;
    const parsedData = JSON.parse(aiContent);

    return {
      category: parsedData.category,
      subcategory: parsedData.subcategory,
      color: parsedData.color,
      season: parsedData.season,
      occasion: parsedData.occasion,
    };
  } catch (error) {
    console.error("Error categorizing clothing:", error);
    throw error;
  }
};
