from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(
    title="ChainPulse AI API",
    version="1.0.0"
)

class Coin(BaseModel):
    value: float = Field(gt=0)
    typeOfCoin: str = Field(min_length=2)
    priceUSD: float = Field(ge=0)

class StatsResponse(BaseModel):
    value: float
    typeOfCoin: str
    priceUSD: float

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/stats", response_model=StatsResponse)
def stats(coin: Coin):
    return {
        "value": coin.value,
        "typeOfCoin": coin.typeOfCoin,
        "priceUSD": coin.priceUSD
    }
