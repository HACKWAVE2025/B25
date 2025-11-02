# backend\gemini_llm_wrapper.py
# ✅ Stable Gemini Wrapper for IMAS MDT Simulation (with safety + retry)

import google.generativeai as genai
from google.api_core.exceptions import GoogleAPIError


class GeminiLLMWrapper:
    """A clean wrapper around Google Gemini for chat-like use cases."""

    def __init__(self, api_key: str, model: str = "gemini-2.5-flash"):
        """Initialize Gemini client and model."""
        try:
            genai.configure(api_key=api_key)
            self.client = genai
            self.model = genai.GenerativeModel(model)
            print(f"✅ Gemini LLM Wrapper initialized with model: {model}")
        except Exception as e:
            print(f"❌ Failed to initialize Gemini: {e}")
            raise

    def generate_reply(self, messages: list, **kwargs) -> str:
        """
        Generates a text reply from Gemini.
        Expects messages as a list of dicts like:
        [{"role": "user", "content": "text"}, {"role": "assistant", "content": "text"}]
        """
        # Combine chat messages into a single coherent prompt
        prompt = ""
        for message in messages:
            role = message.get("role", "user")
            content = message.get("content", "")
            if not content:
                continue
            if role == "user":
                prompt += f"User: {content}\n"
            elif role == "assistant":
                prompt += f"Assistant: {content}\n"
            else:
                prompt += f"{role.capitalize()}: {content}\n"

        try:
            # Send prompt to Gemini with relaxed safety filters
            response = self.model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(
                    temperature=kwargs.get("temperature", 0.6),
                    # FIX: Increased max_output_tokens to avoid finish_reason=2 error
                    max_output_tokens=kwargs.get("max_tokens", 2048),
                ),
                safety_settings=[
                    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
                ],
            )

            # ✅ Extract response text safely
            if hasattr(response, "text") and response.text and response.text.strip():
                return response.text.strip()

            # ✅ Retry once if response was empty or filtered
            print("⚠ Gemini returned empty or filtered response, retrying with simpler prompt...")
            retry_prompt = f"Summarize this clearly:\n{prompt}"
            retry_response = self.model.generate_content(
                retry_prompt,
                generation_config=genai.GenerationConfig(
                    temperature=0.5,
                    max_output_tokens=512,
                ),
                safety_settings=[
                    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
                ],
            )

            if hasattr(retry_response, "text") and retry_response.text and retry_response.text.strip():
                return retry_response.text.strip()

            # ✅ Fallback: extract from candidates (rare older behavior)
            all_texts = []
            if hasattr(response, "candidates"):
                for cand in response.candidates:
                    if hasattr(cand, "content") and hasattr(cand.content, "parts"):
                        for part in cand.content.parts:
                            if hasattr(part, "text"):
                                all_texts.append(part.text)
            return " ".join(all_texts).strip() if all_texts else "Gemini returned empty response after retry."

        except GoogleAPIError as e:
            return f"Gemini API error: {str(e)}"
        except Exception as e:
            return f"Gemini error: {str(e)}"


# ✅ Test standalone before running MDT
if __name__ == "__main__":
    import os

    api_key = os.getenv("GOOGLE_API_KEY") or input("Enter your Gemini API key: ")
    gemini = GeminiLLMWrapper(api_key)

    print("\nTesting Gemini Response...\n")
    messages = [
        {"role": "user", "content": "List three possible causes of fever and jaundice."}
    ]

    reply = gemini.generate_reply(messages)
    print("Gemini Output:\n", reply)