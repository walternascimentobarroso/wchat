import asyncio
import random


_RESPONSES = [
    "Interesting question! Let me think about that for a moment.",
    "That's a great point. Here's what I think about it.",
    "I understand what you mean. From my perspective, this is quite complex.",
    "Thanks for sharing that. I'd like to explore this further with you.",
    "You raise a valid concern. Let me address it step by step.",
]


async def stream_response(user_message: str):
    """Yields response tokens with a small delay to simulate streaming."""
    response = random.choice(_RESPONSES)
    words = response.split()

    for i, word in enumerate(words):
        suffix = " " if i < len(words) - 1 else ""
        yield word + suffix
        await asyncio.sleep(0.07)
