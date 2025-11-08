
import { GoogleGenAI } from "@google/genai";
import { Coordinates } from '../types';

export async function findLocationCoordinates(
  query: string,
  userLocation: Coordinates
): Promise<{ coordinates: Coordinates; name: string } | null> {
  // Assume process.env.API_KEY is available in the environment
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY 환경 변수가 설정되지 않았습니다.");
  }
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `다음 위치의 좌표를 찾아주세요: ${query}`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            },
          },
        },
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks && groundingChunks.length > 0) {
      for (const chunk of groundingChunks) {
        if (chunk.maps && chunk.maps.latLng) {
          return {
            coordinates: {
              latitude: chunk.maps.latLng.latitude,
              longitude: chunk.maps.latLng.longitude,
            },
            name: chunk.maps.title || query,
          };
        }
      }
    }
    // Fallback if no specific map chunk is found, but a text response exists.
    // This is a simplified fallback; a real app might need more robust parsing.
    console.warn("그라운딩 청크에서 특정 지도 좌표를 찾을 수 없습니다. 텍스트 분석을 시도합니다.");
    const textResponse = response.text.toLowerCase();
    const latLonRegex = /latitude: ([-]?\d+\.\d+), longitude: ([-]?\d+\.\d+)/;
    const match = textResponse.match(latLonRegex);

    if (match && match[1] && match[2]) {
        return {
            coordinates: {
                latitude: parseFloat(match[1]),
                longitude: parseFloat(match[2]),
            },
            name: query
        };
    }


    return null;
  } catch (error) {
    console.error("Gemini API 호출 오류:", error);
    throw new Error("Gemini API에서 위치를 가져오는데 실패했습니다.");
  }
}
