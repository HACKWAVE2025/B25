# backend/adapter.py

class GeminiAdapter:
    """Wraps a function to provide a .generate_reply method."""
    def _init_(self, llm_callable):
        if not callable(llm_callable):
            raise ValueError("llm_callable must be callable")
        self._llm_callable = llm_callable

    def generate_reply(self, messages):
        return self._llm_callable(messages)