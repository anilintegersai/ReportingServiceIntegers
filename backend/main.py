from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import embed, manifests, auth

app = FastAPI(title="Insight Hub API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(manifests.router)
app.include_router(embed.router)


@app.get("/health")
def health():
    return {"status": "ok"}
