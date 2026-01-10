Confirm user exists
Authenticate users with auth tokens stored as cookie.
If absent, authenticate users with OTP (via email). Will require integration to AWS SES

Expose a middleware interface that can be used by other packages to authenticate users for every request