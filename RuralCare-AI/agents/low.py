# backend/agents/low.py
"""
Primary Care Provider (PCP) agent for low-complexity medical cases.
Updated to use GeminiPCP for actionable, patient-friendly advice and clear moderator summaries.
"""

from types import SimpleNamespace

class GeminiPCP:
    """Gemini-based Low Complexity Handler (PCP)"""

    def __init__(self, llm_generate_callable):
        if not callable(llm_generate_callable):
            raise ValueError("Provide a callable LLM wrapper")
        self.llm_generate = llm_generate_callable

        # Simulate agent structure
        self.agent = SimpleNamespace()
        self.agent.generate_reply = self._wrap_safe

    def _wrap_safe(self, messages):
        """Safely call Gemini LLM and handle errors gracefully."""
        try:
            res = self.llm_generate(messages)
            return res.strip() if isinstance(res, str) else getattr(res, "text", "No response.")
        except Exception as e:
            return f"[PCP] LLM error: {e}"

    def generate_reply(self, patient_text: str) -> str:
        """
        Generate a full-length medical response focused on actionable advice.
        The model should respond like a real PCP.
        """
        prompt = (
            f"You are a Primary Care Physician handling a low-complexity case.\n"
            f"The patient reports: {patient_text}\n\n"
            "Provide a structured, clear medical note including:\n"
            "1. Summary of condition\n"
            "2. Possible causes or diagnosis\n"
            "3. Step-by-step advice (rest, fluids, medications, follow-up)\n"
            "4. When to seek further care\n\n"
            "Be concise and reassuring, not overly technical."
        )
        messages = [{"role": "user", "content": prompt}]
        return self.agent.generate_reply(messages)

    def simplify_reply(self, text: str) -> str:
        """
        Simplify the doctor reply into short, layman-friendly advice (3–5 key points).
        """
        lines = [line.strip("-• ") for line in text.split("\n") if line.strip()]
        simplified = []
        for line in lines:
            if len(simplified) < 5 and "." in line:
                simplified.append(f"- {line.strip()}")
        return "Patient-friendly advice:\n" + "\n".join(simplified or ["- Rest and hydrate", "- Follow prescribed medicines", "- Monitor your symptoms"])


# --------------------------------------------------
# Wrapper for multilingual / routing compatibility
# --------------------------------------------------
class AgentPCP:
    def __init__(self, llm_generate_callable, src_lang: str = "eng"):
        self.src_lang = src_lang
        self.low_handler = GeminiPCP(llm_generate_callable)

    def translate(self, message: str, src: str, target: str):
        """Dummy translation — extend for multilingual if needed."""
        return message

    def generate_reply(self, query: str) -> str:
        """Generate the medical response for low complexity cases."""
        eng_query = self.translate(query, src=self.src_lang, target="eng")
        response = self.low_handler.generate_reply(eng_query)
        return response

    def simplify_reply(self, response: str) -> str:
        """Simplify and translate (if needed) the PCP's technical reply."""
        simplified = self.low_handler.simplify_reply(response)
        return self.translate(simplified, "eng", self.src_lang)

    def moderator_summary(self, response: str) -> str:
        """
        Create a short moderator summary explaining what happened in the case.
        Useful for audit logs and safe display.
        """
        return (
            "Handled by Primary Care Physician (GeminiPCP). "
            "Generated structured advice with rest, hydration, and follow-up guidance."
            if response else "No PCP response generated."
        )