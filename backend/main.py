from fastapi import FastAPI
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import requests
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from pydantic import BaseModel

load_dotenv()
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models for POST request bodies
class SummaryRequest(BaseModel):
    title: str
    description: str


class ChatRequest(BaseModel):
    title: str
    question: str


@app.get("/")
def root():
    return {"message": "Book hUB API is running"}


@app.get("/books")
def get_search_books(
    q: str = "bestseller",
    orderBy: str = "relevance",
    minRating: int = 0,
    startIndex: int = 0,
    maxResults: int = 20,
    category: str = "",
):
    api_key = os.getenv("GOOGLE_BOOKS_API_KEY")
    query = q if q else "bestsellers"
    if category:
        query += f"subject+{category}"

    # Rating filter ho toh Google se zyada books fetch karo (max 40 Google ka limit hai)
    google_fetch = 40 if minRating else maxResults
    url = (
        f"https://www.googleapis.com/books/v1/volumes"
        f"?q={query}&startIndex={startIndex}&maxResults={google_fetch}"
        f"&orderBy={orderBy}&key={api_key}"
    )
    response = requests.get(url)
    data = response.json()

    books = []
    for item in data.get("items", []):
        info = item["volumeInfo"]
        rating = info.get("averageRating", None)

        # Rating filter apply karo
        if minRating and (rating is None or rating < minRating):
            continue

        # Enough books mil gayi toh stop karo
        if len(books) >= maxResults:
            break

        books.append(
            {
                "id": item["id"],
                "title": info.get("title", "No Title"),
                "authors": info.get("authors", ["Unknown"]),
                "rating": rating,
                "genre": info.get("categories", ["Unknown"]),
                "image": info.get("imageLinks", {}).get("thumbnail", None),
                "description": info.get("description", "No description available"),
                "publishedDate": info.get("publishedDate", ""),
                "pageCount": info.get("pageCount", None),
            }
        )
    return {"books": books, "totalItems": data.get("totalItems", 0)}


@app.get("/books/{book_id}")
def get_book(book_id: str):
    # Single book fetch by ID (book detail page refresh ke liye)'
    api_key = os.getenv("GOOGLE_BOOKS_API_KEY")
    url = url = f"https://www.googleapis.com/books/v1/volumes/{book_id}?key={api_key}"
    response = requests.get(url)
    data = response.json()
    info = data.get("volumeInfo", {})

    return {
        "id": data["id"],
        "title": info.get("title", "No Title"),
        "authors": info.get("authors", ["Unknown"]),
        "rating": info.get("averageRating", None),
        "genre": info.get("categories", ["Unknown"]),
        "image": info.get("imageLinks", {}).get("thumbnail", None),
        "description": info.get("description", "No description available"),
        "publishedDate": info.get("publishedDate", ""),
        "pageCount": info.get("pageCount", None),
    }


@app.post("/summary")
def get_summary(req: SummaryRequest):
    print("req", req)
    model = ChatGroq(model="llama-3.3-70b-versatile")
    response = model.invoke(
        [
            SystemMessage(
                content=f"""You are an expert book critic and literary analyst with deep knowledge of literature.
For the book '{req.title}', provide a specific and insightful response.

1. Write a compelling 5-6 line summary that covers:
   - The core theme and what the book is really about
   - What makes this book unique or important
   - Why a reader should pick it up

2. Write exactly 4 thought-provoking questions a curious reader would want to ask about THIS specific book.

Format your response EXACTLY like this (no extra text, no thinking):
SUMMARY: [your summary here]
QUESTIONS:
[question 1]
[question 2]
[question 3]
[question 4]"""
            ),
            HumanMessage(content=f"Book title: {req.title}\nDescription: {req.description}"),
        ]
    )
    content = response.content
    summary = content
    print("summary", summary)
    questions = []
    # Response parse karo
    if "SUMMARY:" in content and "QUESTIONS" in content:
        parts = content.split("QUESTIONS")
        summary = parts[0]
        questions = [
            q.strip()
            for q in parts[1].strip().split("\n")
            if q.strip() and q.strip() != ":"
        ][:4]

    return {"summary": summary, "suggestions": questions}


@app.post("/chat")
def get_chat(req: ChatRequest):
    model = ChatGroq(model="llama-3.3-70b-versatile")
    response = model.invoke(
        [
            SystemMessage(
                content=f"""You are an expert literary analyst and book critic specializing in '{req.title}'.
Answer questions about this book with depth and insight.
Keep answers concise but meaningful.

Also suggest exactly 3 follow-up questions the user might want to ask next about this book.

Format your response EXACTLY like this:
ANSWER: [your answer here]
FOLLOW_UP:
[question 1]
[question 2]
[question 3]

IMPORTANT — Language detection:
- User writes in English → respond in English
- User writes in Hinglish → respond in Hinglish
Match the user's language exactly."""
            ),
            HumanMessage(content=req.question),
        ]
    )
    content = response.content
    answer = content
    follow_ups = []

    if "ANSWER:" in content and "FOLLOW_UP:" in content:
        parts = content.split("FOLLOW_UP:")
        answer = parts[0].replace("ANSWER:", "").strip()
        follow_ups = [
            q.strip()
            for q in parts[1].strip().split("\n")
            if q.strip()
        ][:3]

    return {"answer": answer, "follow_ups": follow_ups}
