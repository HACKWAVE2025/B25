# backend/modules/symptom_collector.py
from time import sleep

class SymptomCollector:
    def __init__(self, llm):
        # Store the LLM callable or instance
        self.llm = llm

    def gemini_reply_to_str(self, messages):
        """Safely call the LLM and return a string."""
        try:
            # Handle both callable function and object with .generate_reply
            res = self.llm(messages) if callable(self.llm) else self.llm.generate_reply(messages)
            
            # Extract text robustly
            if hasattr(res, "text") and res.text.strip():
                return res.text.strip()
            elif isinstance(res, str) and res.strip():
                return res.strip()
            else:
                return "No response." # Return a consistent default
        except Exception as e:
            # Log the specific error
            print(f"⚠ SymptomCollector LLM Error in gemini_reply_to_str: {e}") 
            # Optionally: import traceback; traceback.print_exc() # For more detailed debug
            return "No response."

    def clarification_loop(self, initial_input, max_rounds=3):
        """Original INTERACTIVE loop for CLI use (run_v2.py). Uses input()."""
        collected = initial_input.strip()
        print("Starting interactive CLI clarification loop...") # For debugging
        
        for round_no in range(max_rounds):
            prompt = (
                f"You are a friendly medical assistant. Patient says: '{collected}'. "
                "Ask 1 short follow-up question to clarify or request missing important symptoms, "
                "in simple language. Do not diagnose yet. If enough info, say 'no further questions'."
            )
            followup = self.gemini_reply_to_str([{"role": "user", "content": prompt}])
            
            # Check for termination conditions
            if not followup or followup == "No response." or "no further" in followup.lower() or "enough info" in followup.lower():
                print("\n✅ System: Enough information collected.\n")
                break

            print(f"\n🤖 Follow-up question: {followup}")
            # --- BLOCKING INPUT (Only for CLI) ---
            ans = input("👤 Patient / CHW answer: ").strip() 
            collected += " | " + followup + ": " + (ans or "unknown")
            sleep(0.15) # Small delay

            # Optional confidence check (can be kept or removed if not reliable)
            confidence_prompt = [
                 {"role": "system", "content": "Rate how complete the information is (0 to 100) for medical assessment. Respond ONLY with the number."},
                 {"role": "user", "content": collected}
            ]
            confidence_str = self.gemini_reply_to_str(confidence_prompt)
            try:
                score_str = ''.join(ch for ch in confidence_str if ch.isdigit())
                score = int(score_str) if score_str else 50 # Default if empty
            except ValueError:
                score = 50 # Default on error
            
            print(f"(Debug: Confidence Score = {score})") # Debug print
            if score >= 70:
                print("\n✅ Confidence threshold reached.")
                break
                
        return collected

    # --- NEW METHOD FOR API SERVER ---
    def clarification_loop_non_interactive(self, initial_input, max_rounds=3):
        """
        NON-INTERACTIVE loop for API use. Generates questions without asking for input.
        Returns the initial text and the list of generated questions.
        """
        print("Starting NON-INTERACTIVE clarification loop for API...") # For debugging
        collected_context_for_questions = initial_input.strip() # Context builds hypothetically
        questions_asked = []
        
        for round_no in range(max_rounds):
            prompt = (
                f"You are a friendly medical assistant. Based ONLY on this info: '{collected_context_for_questions}'. "
                "Ask 1 short, essential follow-up question to clarify symptoms for a diagnosis. "
                "Return ONLY the question text. If no more questions needed, say 'no further questions'."
            )
            followup = self.gemini_reply_to_str([{"role": "user", "content": prompt}])
            
            # Check for termination conditions
            if not followup or followup == "No response." or "no further" in followup.lower() or "enough info" in followup.lower():
                print(f"Non-interactive loop ended at round {round_no+1}: No further questions generated.")
                break
            
            # Avoid asking repetitive questions (simple check)
            # Normalize whitespace and case for comparison
            normalized_followup = ' '.join(followup.lower().split())
            normalized_asked = [' '.join(q.lower().split()) for q in questions_asked]

            if normalized_followup not in normalized_asked:
                questions_asked.append(followup)
                print(f"Generated Question {round_no+1}: {followup}")
                # Add a placeholder answer to the context to potentially guide the LLM for the next question
                collected_context_for_questions += f" | {followup}: Patient provided an answer." 
            else:
                print(f"Skipping potentially repetitive question: {followup}")
                # If question is repetitive, maybe try asking a different one? Or just proceed.
                # For simplicity, we'll just let the loop continue here.

            # Optional: Add confidence check based on collected_context_for_questions if needed
            # (Note: Confidence might be less reliable without real answers)

        # Return the original input text and the list of questions generated
        return initial_input.strip(), questions_asked