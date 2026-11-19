
from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List

app = FastAPI(
    title="ChainPulse AI API",
    version="1.0.0"
)


class Coin(BaseModel):
    value: float = Field(gt=0)
    typeOfCoin: str = Field(min_length=2)
    priceUSD: float = Field(ge=0)
    change24h: float = Field(ge=-100, le=100)


class StatsResponse(BaseModel):
    value: float
    typeOfCoin: str
    priceUSD: float


class AnalyticsRequest(BaseModel):
    coins: List[Coin]


class AnalyticsResponse(BaseModel):
    totalCoins: int
    averagePriceUSD: float
    highestPriceUSD: float
    lowestPriceUSD: float
    gainers: int
    losers: int
    averageChange24h: float


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


@app.post("/analytics", response_model=AnalyticsResponse)
def analytics(request: AnalyticsRequest):

    coins = request.coins

    if not coins:
        return {
            "totalCoins": 0,
            "averagePriceUSD": 0,
            "highestPriceUSD": 0,
            "lowestPriceUSD": 0,
            "gainers": 0,
            "losers": 0,
            "averageChange24h": 0
        }

    prices = [coin.priceUSD for coin in coins]
    changes = [coin.change24h for coin in coins]

    return {
        "totalCoins": len(coins),
        "averagePriceUSD": round(sum(prices) / len(prices), 4),
        "highestPriceUSD": max(prices),
        "lowestPriceUSD": min(prices),
        "gainers": sum(1 for change in changes if change > 0),
        "losers": sum(1 for change in changes if change < 0),
        "averageChange24h": round(sum(changes) / len(changes), 2)
    }
