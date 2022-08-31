import jwt, datetime
from rest_framework import exceptions


'''
Authentication is implemented with JWT access tokens and refresh tokens. On successful authentication the API returns a short lived JWT access token that
expires after 15 minutes, and a refresh token that expires after 7 days in an HTTP Only cookie. 
The JWT is used for accessing secure routes on the API and the refresh token is used for generating new JWT access tokens when (or just before) they
expire.
HTTP Only cookies are used for refresh tokens to increase security because they are not accessible to client-side javascript which prevents XSS 
(cross site scripting) attacks, and refresh tokens only have access to generate new JWT tokens (via the /users/refresh-token route) which prevents them
from being used in CSRF (cross site request forgery) attacks.


Access Tokens and Refresh Token are created using id of an model(since it uniquely identifies it.). They are not accessible via Js.
'''

#Genetate access token that will live for 30sec. It is encoded with access_secret wit HS256 algorithm
#used to access certain endpoint.
def create_access_token(id):
    return jwt.encode({
        'user_id': id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=60),
        #created at
        'iat': datetime.datetime.utcnow()
    }, 'access_secret', algorithm='HS256')

def decode_access_token(token):
    try:
        payload = jwt.decode(token, 'access_secret', algorithms='HS256')
        return payload['user_id']
    except:
        raise exceptions.AuthenticationFailed('unauthenticated')


#Creating Refresh token is similar to creating access token 
#It will live longer than access token.
def create_refresh_token(id):
    return jwt.encode({
        'user_id': id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
        'iat': datetime.datetime.utcnow()
    }, 'refresh_secret', algorithm='HS256')

def decode_refresh_token(token):
    try:
        payload = jwt.decode(token, 'refresh_secret', algorithms='HS256')

        return payload['user_id']
    except:
        raise exceptions.AuthenticationFailed('unauthenticated')