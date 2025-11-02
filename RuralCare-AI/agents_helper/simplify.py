# backend/agents_helper\simplify.py
from autogen import AssistantAgent

class AgentSimplify:
    def __init__(self, llm_config):
        self.system_prompt = (
            "You are an advanced language model tasked with simplifying medical diagnoses for patients "
            "and Community Health Workers in low-resource areas. Your goal is to make sure that the medical "
            "information is easy to understand, without losing the essential details. "
            "Replace complex medical terminology with simpler words, use plain language, "
            "be clear and concise, and provide actionable advice."
        )

        self.agent = AssistantAgent(
            name="simplify",
            system_message=self.system_prompt,
            llm_config=llm_config,
            human_input_mode="NEVER"
        )