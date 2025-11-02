# backend/modules/complexity.py (FIXED to enforce MEDIUM complexity for chronic NCDs)
class ComplexityAssessor:
    """
    Dynamically assesses case complexity using Gemini LLM + fallback logic.
    """
    def __init__(self, llm_generate_reply=None):
        self.llm_generate_reply = llm_generate_reply

    def assess(self, symptom_summary: dict) -> str:
        patient_text = symptom_summary.get("raw_text", "")
        symptoms = symptom_summary.get("symptoms", [])
        possible_diseases = symptom_summary.get("possible_diseases", [])

        # --- Step 1: Try Gemini AI-based reasoning (MODIFIED PROMPT) ---
        if self.llm_generate_reply:
            prompt = (
                f"Given these symptoms and context:\n'{patient_text}'\n\n"
                "Classify the overall case complexity as one of the following:\n"
                "- low: mild or common, manageable with basic care\n"
                "- medium: moderate, needs multi-specialist review\n"
                "- high: severe, emergency or critical care needed\n\n"
                # ✅ CRITICAL ADDITION: General Instruction Guardrail to guide Gemini toward MEDIUM
                "NOTE: Classify cases with ONLY chronic pain (e.g., lasting months) and chronic NCD symptoms "
                "(e.g., long-term diabetic vision/nerve changes, not sudden blindness) as 'medium'. "
                "Only use 'high' for acute, life-threatening crises.\n"
                "Respond with only one word: low, medium, or high."
            )
            try:
                reply = self.llm_generate_reply([{"role": "user", "content": prompt}]).strip().lower()
                if reply in ["low", "medium", "high"]:
                    return reply
            except Exception as e:
                print(f"⚠ Gemini complexity reasoning failed: {e}")

        # --- Step 2: Fallback rule-based logic ---
        text = patient_text.lower()
        if any(k in text for k in ["severe", "bleeding", "unconscious", "stroke", "heart attack", "seizure", "collapsed"]):
            return "high"
        elif any(k in text for k in ["chest pain", "breathing", "vomiting", "abdominal pain", "jaundice", "dizziness", "fainting"]):
            return "medium"
        elif len(symptoms) <= 2 and all(d.lower() in ["cold", "flu", "fever"] for d in possible_diseases):
            return "low"
        else:
            return "medium"