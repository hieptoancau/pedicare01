
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Use the environment variable directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const checkSymptoms = async (symptoms: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User describes symptoms for a child: "${symptoms}". 
      Provide a brief, supportive summary of what this could be, some immediate care tips, and a clear disclaimer that this is not medical advice. 
      Keep it professional yet friendly for a worried parent. Output in Vietnamese.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Xin lỗi, hiện tại tôi không thể xử lý yêu cầu này. Vui lòng liên hệ bác sĩ ngay nếu bé có triệu chứng nặng.";
  }
};

export const getDailyHealthTip = async () => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate one brief, practical pediatric health tip for today. Focus on nutrition, hygiene, or seasonal illness prevention. Language: Vietnamese.",
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return response.text;
  } catch (error) {
    return "Luôn giữ ấm cho bé và cho bé uống đủ nước mỗi ngày nhé mẹ!";
  }
};

// Audio Utilities for Live API
export function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encodeBase64(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const createAudioBlob = (data: Float32Array): { data: string; mimeType: string } => {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encodeBase64(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
};

export const connectLiveConsultant = (callbacks: any) => {
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
      },
      systemInstruction: 'Bạn là bác sĩ nhi khoa ảo thân thiện. Bạn đang tư vấn cho cha mẹ về sức khỏe của con họ qua giọng nói. Hãy trả lời ngắn gọn, ấm áp và luôn nhắc nhở họ đi khám nếu có dấu hiệu nguy hiểm.',
    },
  });
};
