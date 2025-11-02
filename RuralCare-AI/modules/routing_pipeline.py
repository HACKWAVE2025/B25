# backend/modules/routing_pipeline.py
import os
import uuid
from datetime import datetime
from dotenv import load_dotenv
from modules.symptom_collector import SymptomCollector
from modules.symptom_shortlister import SymptomShortlister
from modules.complexity import ComplexityAssessor
from agents.low import GeminiPCP
from agents.medium import MDTAgentGroup
from agents.high import HighCaseHandler
from gemini_llm_wrapper import GeminiLLMWrapper


class RoutingPipeline:
    def __init__(self, external_llm_generate=None):
        """
        Initialize the Routing Pipeline.
        - If external_llm_generate is passed (from FastAPI server), use it.
        - Otherwise, initialize internal GeminiLLMWrapper for standalone runs.
        """
        load_dotenv()

        if external_llm_generate:
            # Accept either callable or object with .generate_reply()
            if callable(external_llm_generate):
                self._safe_generate_reply = external_llm_generate
            elif hasattr(external_llm_generate, "generate_reply"):
                self._safe_generate_reply = external_llm_generate.generate_reply
            else:
                raise ValueError("external_llm_generate must be callable or have a .generate_reply() method")

            self.llm = None
            print("✅ RoutingPipeline initialized with external LLM generate function\n")

        else:
            # Standalone mode: use internal Gemini LLM
            api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
            if not api_key:
                api_key = input("Enter your Gemini API key: ").strip()

            self.llm = GeminiLLMWrapper(api_key=api_key, model="gemini-2.5-flash")
            print("✅ Gemini LLM Wrapper initialized with model: gemini-2.5-flash\n")
            self._safe_generate_reply = self._internal_safe_generate_reply

        # LLM config for MDT
        self.llm_config = {"custom_generate_reply": self._safe_generate_reply}

        # Initialize submodules
        self.collector = SymptomCollector(self._safe_generate_reply)
        self.shortlister = SymptomShortlister(self._safe_generate_reply)
        self.complexity = ComplexityAssessor(self._safe_generate_reply)
        self.low_handler = GeminiPCP(self._safe_generate_reply)
        self.mdt_handler = MDTAgentGroup(self.llm_config, src_lang="eng")
        self.high_handler = HighCaseHandler()

    def _internal_safe_generate_reply(self, messages):
        """Internal fallback LLM method (standalone mode)."""
        try:
            res = self.llm.generate_reply(messages)
            return res.text.strip() if hasattr(res, "text") else str(res).strip()
        except Exception as e:
            print(f"⚠ Gemini generate_reply error: {e}")
            return ""

    def process_case(self, patient_description: str) -> dict:
        """Main routing logic for a clinical case."""
        print("\n🩺 Starting Interactive Routing Pipeline...\n")

        case_id = str(uuid.uuid4())[:8].upper()
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"📂 Case ID: {case_id}")
        print(f"🕒 Timestamp: {timestamp}\n")

        # Step 1: Collect patient info
        collected_text = self.collector.clarification_loop(patient_description)
        print("\n📄 Case Summary Collected:")
        print(collected_text)

        # Step 2: Shortlist symptoms & diseases
        symptom_summary = self.shortlister.shortlist(collected_text)
        print("\n✅ Shortlisted Symptoms & Possible Diseases:")
        print(symptom_summary)

        # Step 3: Assess complexity
        case_complexity = self.complexity.assess(symptom_summary)
        print(f"🧠 Case Complexity: {case_complexity.upper()}")

        result = {
            "case_id": case_id,
            "timestamp": timestamp,
            "symptoms": symptom_summary.get("symptoms", []),
            "possible_diseases": symptom_summary.get("possible_diseases", []),
        }

        # Step 4: Route by complexity
        if case_complexity == "low":
            print("\n📋 Routing to PCP (Low Complexity)...")
            tech_response = self.low_handler.generate_reply(collected_text)
            patient_advice = self.low_handler.simplify_reply(tech_response)
            result.update({
                "route": "Low (PCP)",
                "specialists_involved": ["Primary Care Physician"],
                "specialist_discussion": tech_response,
                "moderator_technical_summary": "Handled directly by PCP LLM.",
                "patient_friendly_advice": patient_advice,
            })

        elif case_complexity == "medium":
            print("\n👨‍⚕ Routing to MDT (Medium Complexity)...")
            symptoms, specialists, tech_summary, advice, discussion = self.mdt_handler.run_interactive_case(
                collected_text, ask_user_callable=lambda q: input(q)
            )
            result.update({
                "route": "Medium (MDT)",
                "symptoms": symptoms,
                "possible_diseases": symptom_summary.get("possible_diseases", []),
                "specialists_involved": specialists,
                "specialist_discussion": discussion or "No detailed discussion available.",
                "moderator_technical_summary": tech_summary.strip("*").strip(),
                "patient_friendly_advice": advice.strip("*").strip(),
            })

        elif case_complexity == "high":
            print("\n🚨 Routing to High Case Handler (Emergency)...")
            emergency_advice = self.high_handler.handle(symptom_summary)
            result.update({
                "route": "High (Emergency)",
                "specialists_involved": ["Emergency Response Team"],
                "specialist_discussion": "Immediate referral to ER initiated.",
                "moderator_technical_summary": "Critical condition — auto escalation.",
                "patient_friendly_advice": emergency_advice,
            })

        else:
            result.update({
                "route": "Unknown",
                "moderator_technical_summary": "Could not determine case complexity.",
                "patient_friendly_advice": "Please provide more details.",
            })

        print("\n✅ Routing Complete.\n")
        print(f"📂 Case ID: {case_id} | 🕒 Time: {timestamp}\n")
        return result


if __name__ == "__main__":
    patient_input = input("👨‍⚕ Describe patient (age, gender, main complaints):\n> ")
    router = RoutingPipeline()
    router.process_case(patient_input)