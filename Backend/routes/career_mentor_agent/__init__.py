"""
Career Mentor Agent Package
===========================
A professional AI-powered career mentoring system built with LangChain and Groq.
Includes memory (Mem0) and web search (ScrapingBee) tools.
"""

from .agent import CareerMentorAgent, create_agent, CAREER_MENTOR_SYSTEM_PROMPT
from .tools import recall_memory, save_memory, web_search, get_tools

__all__ = [
    # Agent
    "CareerMentorAgent",
    "create_agent",
    "CAREER_MENTOR_SYSTEM_PROMPT",
    # Tools
    "recall_memory",
    "save_memory",
    "web_search",
    "get_tools",
]

__version__ = "1.0.0"
