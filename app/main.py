from fastapi import FastAPI, Query, HTTPException
from search import semantic_Search
import traceback
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/search")
async def search(query: str = Query(..., description="Search Query")):
    try:
        result = semantic_Search(query=query, n=10)
        formatted_result = []
        for i, doc in enumerate(result['metadatas'][0]):
            formatted_result.append({
                "document": doc,
                "metadata": result['metadatas'][0][i],
                "distance": result['distances'][0][i]
            })
        return {"results": formatted_result}
    
    except Exception as e:
        print("❌ ERROR:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
