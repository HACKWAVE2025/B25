#backend/ modules/symptom_shortlister.py
class SymptomShortlister:
    """
    Maps symptoms to possible diseases dynamically using Gemini LLM.
    If you want, can also fallback to a small internal knowledge base.
    """

    def __init__(self, llm_generate_reply):
        self.llm_generate_reply = llm_generate_reply
        
        # ✅ FIX: Expanded fallback KB to include complex and high-severity keywords
        self.fallback_kb = {
            "fever": ["malaria", "dengue", "typhoid"],
            "jaundice": ["hepatitis", "cholangitis"],
            "abdominal pain": ["gallstones", "appendicitis", "pancreatitis"],
            "cough": ["bronchitis", "pneumonia"],
            "chest pain": ["angina", "heart attack"],
            
            # --- Added High-Impact/Emergency Keywords ---
            "shortness of breath": ["cardiac failure", "pulmonary embolism"],
            "breathing": ["cardiac failure", "pulmonary embolism"],
            "swollen": ["DVT", "cellulitis", "chronic kidney disease"],
            "throbbing": ["septic arthritis", "cellulitis"],
            "red and hot": ["cellulitis", "septic arthritis"],
            "collapsed": ["stroke", "seizure"],
            # --------------------------------------------
        }

    def shortlist(self, patient_text: str):
        # Initialize the diseases list cleanly
        diseases = []
        
        # Prompt Gemini to suggest possible diseases
        prompt = (
            f"You are a medical assistant. Based on these patient symptoms:\n'{patient_text}'\n"
            "List the top 3-5 likely diseases as plain text, comma-separated."
        )
        
        try:
            reply = self.llm_generate_reply([{"role": "user", "content": prompt}])
            
            # Attempt to parse the LLM's response
            parsed_diseases = [d.strip() for d in reply.split(",") if d.strip()]
            
            # Use parsed list if successful
            if parsed_diseases:
                diseases = parsed_diseases
            
        except Exception as e:
            # ⚠ FIX: Log the error but ensure 'diseases' remains an empty list 
            # if the parsing failed, preventing contamination.
            print(f"⚠ Shortlister LLM Error: {e}. Proceeding with rule-based fallback.")
            
        
        # If Gemini failed OR Gemini gave an empty list, use the KB fallback
        if not diseases:
            diseases = self._fallback_shortlist(patient_text)

        # Extract matched symptoms from the expanded fallback KB for reference
        # This list now correctly identifies symptoms like 'shortness of breath'
        matched_symptoms = [s for s in self.fallback_kb if s in patient_text.lower()]

        return {
            "symptoms": matched_symptoms,
            "possible_diseases": diseases,
            "raw_text": patient_text
        }

    def _fallback_shortlist(self, text: str):
        matched_diseases = set()
        text = text.lower()
        for s, ds in self.fallback_kb.items():
            # Match symptoms in the raw text
            if s in text:
                matched_diseases.update(ds)
                
        # If the KB match is still empty, provide a default high-level differential
        if not matched_diseases:
            return ["Unspecified Systemic Illness"]
            
        return list(matched_diseases)