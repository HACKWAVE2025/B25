# backend/agents/medium.py
from types import SimpleNamespace
from typing import List, Tuple
import time

SPECIALIST_POOL = [
    "gensurgeon", "gastroenterologist", "endocrinologist",
    "infectious_disease_specialist", "cardiologist", "dermatologist",
    "neurologist", "pulmonologist", "nephrologist", "hepatologist",
    "hematologist", "obstetrician"
]

DISEASE_TO_SPECIALISTS = {
    "cholangitis": ["gastroenterologist", "hepatologist", "gensurgeon"],
    "gallstones": ["gastroenterologist", "gensurgeon"],
    "pancreatitis": ["gastroenterologist", "gensurgeon"],
    "hepatitis": ["hepatologist", "gastroenterologist"],
    "malaria": ["infectious_disease_specialist"],
    "dengue": ["infectious_disease_specialist", "hematologist"],
    "typhoid": ["infectious_disease_specialist", "gastroenterologist"],
    "pneumonia": ["pulmonologist", "infectious_disease_specialist"],
    "chest pain": ["cardiologist", "pulmonologist"],
    "stroke": ["neurologist"],
    "renal": ["nephrologist"]
}


class GeminiAgent(SimpleNamespace):
    """Wraps Gemini API call safely for an agent."""
    def __init__(self, name, generate_func):
        super().__init__(name=name)
        self.generate_reply = self._wrap_safe(generate_func, name)

    def _wrap_safe(self, func, role_name):
        def wrapper(messages: List[dict], **kwargs):
            for attempt in range(2):
                try:
                    res = func(messages)
                    if isinstance(res, str) and res.strip():
                        return res.strip()
                    if hasattr(res, "text") and res.text.strip():
                        return res.text.strip()
                    if hasattr(res, "candidates"):
                        cand = res.candidates[0]
                        if hasattr(cand, "content") and getattr(cand.content, "parts", None):
                            text = "".join(p.text for p in cand.content.parts if hasattr(p, "text"))
                            if text.strip():
                                return text.strip()
                    finish_reason = getattr(cand, "finish_reason", None)
                    if finish_reason == "2":
                        time.sleep(0.5)
                        continue
                except Exception as e:
                    if "quick accessor" in str(e):
                        time.sleep(0.5)
                        continue
                    return f"[{role_name.upper()}]: ❌ Error: {e}"
            return f"[{role_name.upper()}]: ⚠ No valid reply after retries."
        return wrapper


class MDTAgentGroup:
    """MDT Group with round-robin discussion and moderator summary."""

    def __init__(self, llm_config: dict,src_lang: str = "eng"):
        gen_func = llm_config.get("custom_generate_reply")
        if not gen_func:
            raise ValueError("MDTAgentGroup requires llm_config with 'custom_generate_reply'")
        self.agents = {sp: GeminiAgent(sp, gen_func) for sp in SPECIALIST_POOL}
        self.moderator = GeminiAgent("moderator", gen_func)

    def _extract_symptoms(self, text: str) -> List[str]:
        prompt = (
            f"Extract key symptom phrases from this patient description:\n'{text}'\n"
            "Return a comma-separated list of symptom keywords."
        )
        reply = self.moderator.generate_reply([{"role": "user", "content": prompt}])
        return [s.strip() for s in reply.split(",") if s.strip()]

    def _auto_select_specialists(self, diseases: List[str], max_specialists=4) -> List[str]:
        selected = []
        for d in diseases:
            if d in DISEASE_TO_SPECIALISTS:
                selected.extend(DISEASE_TO_SPECIALISTS[d])
        if not selected:
            selected = SPECIALIST_POOL[:max_specialists]
        return list(dict.fromkeys(selected))[:max_specialists]

    def run_interactive_case(
        self,
        patient_text: str,
        ask_user_callable,
        max_clarify_rounds: int = 3,
        max_turns: int = 3,
        live: bool = True
    ) -> Tuple[List[str], List[str], str, str, str]:

        collected = patient_text.strip()

        # 1️⃣ Clarifying questions
        for _ in range(max_clarify_rounds):
            prompt = f"You are a triage assistant. Patient: {collected}\nGenerate 3 short follow-up questions."
            qlist = self.moderator.generate_reply([{"role": "user", "content": prompt}]).splitlines()
            qlist = [q.strip() for q in qlist if q.strip()]
            if not qlist:
                break
            for q in qlist:
                print(f"🤖 {q} (type 'dont know' if unknown)")
                ans = ask_user_callable("👤 Answer: ")
                collected += f" | {q}: {ans.strip() if ans else 'unknown'}"

        # 2️⃣ Extract symptoms and select specialists
        symptoms = self._extract_symptoms(collected)
        specialists = self._auto_select_specialists([])

        # 3️⃣ Internal round-robin MDT discussion
        discussion_log = [{"role": "user", "content": f"Patient Symptoms: {collected}"}]

        for turn in range(max_turns):
            if live:
                print(f"===== TURN {turn + 1} =====")
            for sp in specialists:
                prompt = f"You are {sp}. Read the discussion so far and provide your expert input."
                messages = discussion_log + [{"role": "user", "content": prompt}]
                reply = self.agents[sp].generate_reply(messages)
                discussion_log.append({"role": sp, "content": reply})
                if live:
                    print(f"[{sp.upper()}]: {reply}\n")
                    time.sleep(0.5)

        # 4️⃣ Moderator summary
        discussion_text = "\n".join(
            [f"[{m['role'].upper()}]: {m['content']}" for m in discussion_log if m['role'] != "user"]
        )

        moderator_prompt = (
            f"Summarize this MDT discussion:\n{discussion_text}\n"
            "Write two sections:\nTECHNICAL: concise 3–6 sentence diagnosis summary\n"
            "SIMPLE: 3 bullet points advice for the patient."
        )
        moderator_reply = self.moderator.generate_reply([{"role": "user", "content": moderator_prompt}])

        # 5️⃣ Parse moderator reply
        tech_summary, simple_advice = moderator_reply, ""
        if "TECHNICAL:" in moderator_reply and "SIMPLE:" in moderator_reply:
            try:
                tech_summary = moderator_reply.split("TECHNICAL:")[1].split("SIMPLE:")[0].strip()
                simple_advice = moderator_reply.split("SIMPLE:")[1].strip()
            except Exception:
                simple_advice = "⚠ Follow-up advice unavailable."
        else:
            sentences = [s.strip() for s in moderator_reply.split(".") if s.strip()]
            simple_advice = "- " + "\n- ".join(sentences[:3]) if sentences else "⚠ Follow-up advice unavailable."

        # 6️⃣ Print final summary
        if live:
            print("===== MODERATOR SUMMARY =====")
            print(f"TECHNICAL: {tech_summary}\n")
            print(f"SIMPLE: {simple_advice}\n")

        return symptoms, specialists, tech_summary, simple_advice, discussion_text