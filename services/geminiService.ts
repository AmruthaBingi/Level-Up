
import { GoogleGenAI, Type } from "@google/genai";
import { SkillStatus } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateCareerRoadmap(career: string) {
  const prompt = `Generate a detailed career roadmap for a "${career}". 
  Format it as a skill tree with nodes and edges.
  Include 8-12 nodes.
  Start with foundational skills and branch out to specialized skills.
  Assign XP rewards (100-1000) based on complexity.
  Suggest 2-3 learning resources for each skill.
  Provide layout positions (x, y) starting from y=0 and moving downwards.
  
  Only use these status values: 'AVAILABLE' (for level 1 foundation skills) or 'LOCKED' (for everything else).`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          nodes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                label: { type: Type.STRING },
                description: { type: Type.STRING },
                status: { type: Type.STRING },
                xpReward: { type: Type.NUMBER },
                level: { type: Type.NUMBER },
                position: {
                  type: Type.OBJECT,
                  properties: {
                    x: { type: Type.NUMBER },
                    y: { type: Type.NUMBER }
                  },
                  required: ['x', 'y']
                },
                resources: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      url: { type: Type.STRING },
                      type: { type: Type.STRING }
                    }
                  }
                }
              },
              required: ['id', 'label', 'description', 'status', 'xpReward', 'level', 'position']
            }
          },
          edges: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                source: { type: Type.STRING },
                target: { type: Type.STRING }
              },
              required: ['id', 'source', 'target']
            }
          }
        },
        required: ['name', 'description', 'nodes', 'edges']
      }
    }
  });

  try {
    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse AI response", e);
    throw new Error("Failed to generate roadmap. Please try again.");
  }
}
