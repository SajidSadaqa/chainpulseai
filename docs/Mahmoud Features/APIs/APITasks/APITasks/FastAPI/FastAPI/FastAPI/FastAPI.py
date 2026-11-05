from fastapi import FastAPI
import uvicorn
from pydantic import BaseModel

app = FastAPI()

class Coin(BaseModel):
    value : float
    typeOfCoin : str
    priceUSD : float

class statusResponse(BaseModel):
    value : float 
    typeOfCoin : str
    priceUSD : float

@app.get("/health")
def health():
    return {"status" : "ok"}

@app.post("/stats" , response_model=statusResponse)
def stats(coin : Coin):
    return {
        "value" : coin.value ,
        "typeOfCoin" : coin.typeOfCoin , 
        "priceUSD" : coin.priceUSD
        }


# to run the code 
if __name__ == "__main__":
    uvicorn.run("FastAPI:app", host="127.0.0.1", port=8000, reload=True)


