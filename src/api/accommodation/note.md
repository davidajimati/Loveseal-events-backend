Admin can add/update/edit accommodation info
Admin can mark an accommodation as empty/full
Admin can revoke a user's accommodation/re-assign

users can book accommodation and see updated numbers in real time.

Build an algorithm to assign bed spaces, and update necessary tables with the updated numbers and send email update to users


TO DOS

Add capacity left field to the table
Add Room Status field to the table

There should be a table called Accommodation-categories where users can see accomodation names and price

e.g
Hostel1 - 10000
Hostel2 - 12000
Hotel1 - 25000
Hotel2 - 35000

Add categoryId to both hostel and hotel accommodations table

After user selects, i query the accomodation table, find by categoryId and Capacity of NOT-FULL
Allocate one space to the user and edit capacity left on that particular room in the table