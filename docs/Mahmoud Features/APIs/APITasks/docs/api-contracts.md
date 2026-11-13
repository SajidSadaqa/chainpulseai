\# ChainPulse AI - API Contracts



\## 1. ASP.NET Core API



Base URL: `http://localhost:8080`



\### 1.1 Get All Coins



\- \*\*Method:\*\* GET

\- \*\*Endpoint:\*\* `/api/Coins`

\- \*\*Description:\*\* Returns all coins.



\*\*Success Response: 200 OK\*\*

json

\[

&#x20; {

&#x20;   "id": 1,

&#x20;   "name": "Bitcoin",

&#x20;   "symbol": "BTC",

&#x20;   "priceUSD": 65000,

&#x20;   "change24h": 2.5

&#x20; }

]





\### 1.2 Get Coin By ID



\- \*\*Method:\*\* GET

\- \*\*Endpoint:\*\* `/api/Coins/{id}`



\*\*Success:\*\* 200 OK



\*\*Error:\*\* 404 Not Found



\### 1.3 Create Coin



\- \*\*Method:\*\* POST

\- \*\*Endpoint:\*\* `/api/Coins`



\*\*Request Body:\*\*

json

{

&#x20; "name": "Bitcoin",

&#x20; "symbol": "BTC",

&#x20; "priceUSD": 65000,

&#x20; "change24h": 2.5

}





\*\*Success:\*\* 201 Created



\*\*Errors:\*\*

\- 400 Bad Request: Invalid input.



\### 1.4 Update Coin



\- \*\*Method:\*\* PUT

\- \*\*Endpoint:\*\* `/api/Coins/{id}`



\*\*Request Body:\*\* Same structure as Create Coin.



\*\*Success:\*\* 200 OK



\*\*Errors:\*\*

\- 400 Bad Request: Invalid input.

\- 404 Not Found: Coin does not exist.



\### 1.5 Delete Coin



\- \*\*Method:\*\* DELETE

\- \*\*Endpoint:\*\* `/api/Coins/{id}`



\*\*Success:\*\* 200 OK



\*\*Error:\*\* 404 Not Found



\## 2. Validation Rules



| Field | Validation |

|---|---|

| Name | Required, 2-70 characters |

| Symbol | Required, 2-20 characters |

| PriceUSD | Greater than 0 |

| Change24h | Between -100 and 100 |



\## 3. Error Response Format



\### 400 Bad Request



ASP.NET Core returns validation details using ValidationProblemDetails.



Example:

json

{

&#x20; "title": "One or more validation errors occurred.",

&#x20; "status": 400,

&#x20; "errors": {

&#x20;   "Name": \["The Name field is required."]

&#x20; }

}





\### 404 Not Found



json

{

&#x20; "title": "Coin Not Found",

&#x20; "status": 404,

&#x20; "detail": "Coin with ID 999 was not found."

}





\### 500 Internal Server Error



Unexpected server errors are handled centrally.

Stack traces and internal exception details are not exposed to clients.



\## 4. FastAPI



Base URL: `http://127.0.0.1:8000`



\### 4.1 Health Check



\- \*\*Method:\*\* GET

\- \*\*Endpoint:\*\* `/health`

\- \*\*Success:\*\* 200 OK



Response:

json

{

&#x20; "status": "ok"

}





\### 4.2 Get Coin Statistics



\- \*\*Method:\*\* POST

\- \*\*Endpoint:\*\* `/stats`



Request:

json

{

&#x20; "value": 2,

&#x20; "typeOfCoin": "Bitcoin",

&#x20; "priceUSD": 65000

}





Response: 200 OK



json

{

&#x20; "value": 2,

&#x20; "typeOfCoin": "Bitcoin",

&#x20; "priceUSD": 65000

}





\*\*Validation:\*\*

\- value must be greater than 0.

\- typeOfCoin must contain at least 2 characters.

\- priceUSD must be greater than or equal to 0.



\## 5. API Documentation



\- ASP.NET Core Swagger: `/swagger`

\- FastAPI Swagger: `/docs`



\## 6. Review



Reviewers: Amr .



Status: Pending Review.



