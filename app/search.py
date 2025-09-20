import chromadb
from sentence_transformers import SentenceTransformer


model = SentenceTransformer('all-MiniLM-L6-v2')
model.max_seq_length = 256

def semantic_Search(query, n: int):

    client = chromadb.PersistentClient(path="./db")
    collection = client.get_collection(name="news")

    embedding_query = model.encode(query, convert_to_numpy=True).tolist()

    response = collection.query(
        query_embeddings=[embedding_query], 
        n_results=n,
        include=["documents", "metadatas", "distances"]
    )

    return response

