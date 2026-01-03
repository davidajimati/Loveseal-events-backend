
/** THIS FILE IS STILL BEING USED FOR DISCUSSIONS AND DELIBRATIONS

WORK OUTLINE:

- accommodation service -  David Ajimati
- events service -  David Ajimati
- 
- event registration - Bro Blessed
- admin console - Bro Blessed
- 
- billing service -  Bro Semilore
- emailing service - Bro Semilore
- 
- User authentication - Sister Oreoluwa
- User profile service - Sister Oreoluwa



EVENT_REG_TABLE
name
email
phone
church
eventId
payment_made (0,1)
amount
date_made_payment


REG (EMPLOYMENT TYPE) -> ACCOMMODATION -> CHARGE (KORAPAY) -> BACKEND(record billing activity)


**BILLING**
FRONTEND <-> KORAPAY 


ENDPOINTS FOR BILLING SERVICE

- GET amount to pay
- validate payment? & - record transaction
- GET list of all paid participants
- Download list of all paid participants

select * from table1 whre id == id there

- 