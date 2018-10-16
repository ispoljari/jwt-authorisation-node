# A demo API that uses JSON Web Tokens (JWTs) to authenticate users

## API control flow

1. The user signs in by accessing the endpoint /api/users and sending his/hers personal data (username, password, first name, last name) to the server

2. The server validates the request against a set of predefined criteria (are all required fields present in req.body, are all required fields of string type, is the password string trimmed etc.)

3. If all the validation criteria are met, the server hashes the provided password (bcryptjs is used to implement SHA-1 encription), and stores it, together with the rest of the provided data, to a MongoDB database

4. If the validation criteria are not met, server responds with a HTTP 422 status message, together with some useful error description

5. If the sign in was succesful, the server returns the user object back to the client side

6. The user can login by accessing the endpoint /api/auth/ and sending his/hers username and password inside the request body

7. Passport.js is used to authenticate user requests by validating passwords. By defining a localStrategy and mounting it as middleware before the POST /login route handler, the server compares the provided password with the decrypted (previously hashed and stored) DB password, and if they match a JWT string is returned to the user

8. The user can now use the JWT sent by the server, to access restricted resources located at /api/protected/ endpoint. The JWT string is send inside the HTTP header through the Bearer Scheme.

9. The JWT string is then validated using Passport.js again and defining a jwtStrategy which is mounted before the GET /protected route handler. 

10. If the provided token is valid, the server returns the requested resource