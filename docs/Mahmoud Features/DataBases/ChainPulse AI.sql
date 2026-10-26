create table persons (
id serial primary key ,
name VARCHAR(30),
city VARCHAR(30)
);

create table coin_cards (
id serial primary key, 
persons_id INT REFERENCES persons(id),
symbol VARCHAR(10),
priceUSD NUMERIC(10,4),
change24h NUMERIC (10,4)
);

create table bitcoin_historical (
id serial primary key,
coin_cards_id INT REFERENCES coin_cards(id),
timestamps DATE ,
prices NUMERIC(10,4)
);


insert into persons (name , city)
values
('Mahmoud' , 'Demascus'),
('Ali' , 'Amman'),
('Ahmad', 'Riyad'),
('Mousa' , 'Zarqa');


insert into coin_cards (persons_id , symbol , priceUSD , change24h)
values 
(1 , 'USD' , 1.00 , 0),
(1 , 'EUR' , 0.8913 , 0.17),
(2 , 'GBP' , 0.7476 , 0.08),
(3 , 'JPY' , 157.0152 , -0.05),
(4 , 'CHF' , 0.8242 , -0.19);


select *
from persons p
full join coin_cards coin
on p.id = coin.id
full join bitcoin_historical bh
on coin.id = bh.id
order by p.id ;
