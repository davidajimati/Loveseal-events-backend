**WORK OUTLINE:**

- User authentication - David Ajimati   -   DONE
- Admin Authentication - David Ajimati  -   DONE
- User profile service - David Ajimati  -   DONE
- events admin service - David Ajimati

- accommodation service - Bro Mayowa
- billing service - Bro Mayowa

- event registration - Bro Victor
- admin console - Bro Victor

- emailing service - Sister Oreoluwa


<br><br>
**STACK**

- Express
- typescript
- prisma ORM

<br>(br>
**API RESPONSES**

| code (String) | message (String)     | data ({}, [], "", int, ...) | HTTP STATUS           |
|---------------|----------------------|-----------------------------|-----------------------|
| 00            | success              | object (any)                | OK                    |
| 77            | Duplicate request    | object (any)                | DUPLICATE             |
| 99            | Bad request          | object (any)                | BAD REQUEST           |
| 100           | Something went wrong | object (any)                | INTERNAL_SERVER ERROR |


SAMPLE API RESPONSE {
    "code": "00"
    "message": "Success"
    "data": {
        "eventId": "ew-32wee-24rwe-32rwssdedf",
        "eventTitle": "The son of God",
        "totalRegistered": 9832462
    }
}