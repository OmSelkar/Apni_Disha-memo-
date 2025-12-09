"""
Career Mentor Agent Tools
==========================
Tools for the Career Mentor AI Agent:
1. recall_memory - Retrieve user memories from Mem0
2. save_memory - Save user memories to Mem0
3. web_search - Search the web using ScrapingBee + DuckDuckGo
"""

import os
import requests
from typing import Optional, List, Dict, Any
from langchain_core.tools import tool
from mem0 import MemoryClient
from scrapingbee import ScrapingBeeClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ============================================================================
# MEMORY TOOLS (using Mem0)
# ============================================================================

def get_memory_client() -> MemoryClient:
    """Get or create a Mem0 memory client."""
    api_key = os.getenv("MEM0_API_KEY")
    if not api_key:
        raise ValueError("MEM0_API_KEY environment variable is required")
    return MemoryClient(api_key=api_key)


@tool
def recall_memory(query: str, user_id: str = "default_user") -> str:
    """
    Use this tool to retrieve previously saved information about the user.
    Helpful when earlier goals, preferences, background details, or important facts
    are needed to give more personalized guidance.
    Only use this when past memory is relevant to the current request.
    
    Args:
        query: The search query to find relevant memories (e.g., "career goals", "skills", "preferences")
        user_id: The user's unique identifier (default: "default_user")
    
    Returns:
        A string containing relevant memories or a message if no memories found.
    """
    try:
        client = get_memory_client()
        
        # Search for relevant memories using filters (required by Mem0 API)
        results = client.search(query, filters={"user_id": user_id})
        
        if not results or not results.get("results"):
            return f"No memories found for query: '{query}'. This user may not have any saved information yet."
        
        # Format the memories for the agent
        memories = results.get("results", [])
        formatted_memories = []
        
        for i, memory in enumerate(memories, 1):
            memory_text = memory.get("memory", "")
            score = memory.get("score", 0)
            categories = memory.get("categories", [])
            
            formatted = f"{i}. {memory_text}"
            if categories:
                formatted += f" [Categories: {', '.join(categories)}]"
            formatted_memories.append(formatted)
        
        result_text = f"Found {len(memories)} relevant memories:\n" + "\n".join(formatted_memories)
        return result_text
        
    except Exception as e:
        return f"Error retrieving memories: {str(e)}"


@tool
def save_memory(content: str, user_id: str = "default_user") -> str:
    """
    Use this tool to save important, long-term user information such as goals,
    preferences, strengths, progress, or any detail the user wants remembered
    for future conversations.
    Only save after the user confirms or clearly requests you to remember something.
    
    Args:
        content: The information to save (e.g., "User's goal is to become a data scientist", "User has 2 years of Python experience")
        user_id: The user's unique identifier (default: "default_user")
    
    Returns:
        A confirmation message indicating the memory was saved successfully.
    """
    try:
        client = get_memory_client()
        
        # Format the content as a message for mem0
        messages = [
            {"role": "user", "content": content},
            {"role": "assistant", "content": "I'll remember this information for you."}
        ]
        
        # Add the memory
        result = client.add(messages, user_id=user_id)
        
        if result:
            return f"Successfully saved memory: '{content[:100]}{'...' if len(content) > 100 else ''}'"
        else:
            return "Memory saved, but no confirmation received from the server."
            
    except Exception as e:
        return f"Error saving memory: {str(e)}"


# ============================================================================
# WEB SEARCH TOOL (using ScrapingBee + DuckDuckGo)
# ============================================================================

def get_scrapingbee_client() -> ScrapingBeeClient:
    """Get or create a ScrapingBee client."""
    api_key = os.getenv("SCRAPINGBEE_API_KEY")
    if not api_key:
        raise ValueError("SCRAPINGBEE_API_KEY environment variable is required")
    return ScrapingBeeClient(api_key=api_key)


@tool
def web_search(query: str, num_results: int = 5) -> str:
    """
    Use this tool to search the web and retrieve up-to-date information.
    Helpful when answering questions that require factual verification, market trends,
    salary data, job demand, industry insights, or any content requiring current
    real-world information.
    You may call this tool multiple times to refine and improve search results.
    
    Args:
        query: The search query (e.g., "data science salary 2024 India", "top programming languages 2024")
        num_results: Number of search results to return (default: 5, max: 10)
    
    Returns:
        A string containing search results with titles, snippets, and URLs.
    """
    try:
        client = get_scrapingbee_client()
        
        # Limit results to reasonable number
        num_results = min(num_results, 10)
        
        # Use DuckDuckGo HTML search via ScrapingBee
        search_url = f"https://html.duckduckgo.com/html/?q={query}"
        
        response = client.get(
            search_url,
            params={
                'render_js': 'false',
                'premium_proxy': 'false',
            }
        )
        
        if response.status_code != 200:
            return f"Search request failed with status code: {response.status_code}"
        
        # Parse the HTML response to extract search results
        html_content = response.text
        results = parse_duckduckgo_results(html_content, num_results)
        
        if not results:
            return f"No search results found for query: '{query}'. Try a different or more specific query."
        
        # Format results for the agent
        formatted_results = [f"Search results for: '{query}'\n"]
        
        for i, result in enumerate(results, 1):
            formatted_results.append(
                f"{i}. **{result['title']}**\n"
                f"   {result['snippet']}\n"
                f"   URL: {result['url']}\n"
            )
        
        return "\n".join(formatted_results)
        
    except Exception as e:
        return f"Error performing web search: {str(e)}"


def parse_duckduckgo_results(html: str, max_results: int = 5) -> List[Dict[str, str]]:
    """
    Parse DuckDuckGo HTML search results.
    
    Args:
        html: The HTML content from DuckDuckGo
        max_results: Maximum number of results to extract
    
    Returns:
        List of dictionaries containing title, snippet, and url
    """
    from html.parser import HTMLParser
    
    results = []
    
    # Simple regex-based extraction for DuckDuckGo results
    import re
    
    # Find all result blocks
    # DuckDuckGo HTML format: <a class="result__a" href="...">title</a>
    # and <a class="result__snippet">snippet</a>
    
    # Extract result links and titles
    link_pattern = r'<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([^<]*)</a>'
    snippet_pattern = r'<a[^>]*class="result__snippet"[^>]*>([^<]*(?:<[^>]*>[^<]*)*)</a>'
    
    links = re.findall(link_pattern, html)
    snippets = re.findall(snippet_pattern, html)
    
    # Clean up snippets (remove HTML tags)
    clean_snippets = []
    for snippet in snippets:
        clean = re.sub(r'<[^>]+>', '', snippet)
        clean = clean.strip()
        clean_snippets.append(clean)
    
    # Combine results
    for i, (url, title) in enumerate(links[:max_results]):
        snippet = clean_snippets[i] if i < len(clean_snippets) else "No snippet available"
        
        # Clean up the URL (DuckDuckGo uses redirect URLs)
        # Extract actual URL from DuckDuckGo redirect
        actual_url = url
        if 'uddg=' in url:
            url_match = re.search(r'uddg=([^&]+)', url)
            if url_match:
                from urllib.parse import unquote
                actual_url = unquote(url_match.group(1))
        
        results.append({
            'title': title.strip(),
            'snippet': snippet,
            'url': actual_url
        })
    
    return results


# ============================================================================
# TOOL REGISTRY
# ============================================================================

# List of all available tools
ALL_TOOLS = [
    recall_memory,
    save_memory,
    web_search,
]


def get_tools() -> List:
    """
    Get all available tools for the Career Mentor Agent.
    
    Returns:
        List of LangChain tool objects.
    """
    return ALL_TOOLS


# ============================================================================
# TEST FUNCTIONS
# ============================================================================

if __name__ == "__main__":
    print("\n" + "="*60)
    print("TESTING CAREER MENTOR TOOLS")
    print("="*60)
    
    # Test 1: Web Search
    print("\n[TEST 1] Web Search Tool")
    print("-"*40)
    try:
        result = web_search.invoke({"query": "data science career trends 2024"})
        print(result[:500] + "..." if len(result) > 500 else result)
        print("[PASS] Web search working!")
    except Exception as e:
        print(f"[FAIL] Web search error: {e}")
    
    # Test 2: Save Memory
    print("\n[TEST 2] Save Memory Tool")
    print("-"*40)
    try:
        result = save_memory.invoke({
            "content": "Test user is interested in data science and machine learning careers.",
            "user_id": "test_user_001"
        })
        print(result)
        print("[PASS] Save memory working!")
    except Exception as e:
        print(f"[FAIL] Save memory error: {e}")
    
    # Test 3: Recall Memory
    print("\n[TEST 3] Recall Memory Tool")
    print("-"*40)
    try:
        result = recall_memory.invoke({
            "query": "career interests",
            "user_id": "test_user_001"
        })
        print(result)
        print("[PASS] Recall memory working!")
    except Exception as e:
        print(f"[FAIL] Recall memory error: {e}")
    
    print("\n" + "="*60)
    print("TOOL TESTING COMPLETE")
    print("="*60)
