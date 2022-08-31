import email
from rest_framework.authentication import get_authorization_header
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import APIException, AuthenticationFailed

from .authentication import create_access_token, create_refresh_token, decode_access_token, decode_refresh_token
from .serializers import UserSerializer
from .models import User, Reset
import pyotp
import random
import string
from django.core.mail import send_mail

class RegisterAPIView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)



# Login Only View
# class LoginAPIView(APIView):
#     def post(self, request):
#         user = User.objects.filter(email=request.data['email']).first()

#         if not user:
#             raise APIException('Invalid credentials!')

#         if not user.check_password(request.data['password']):
#             raise APIException('Invalid credentials!')

#         access_token = create_access_token(user.id)
#         refresh_token = create_refresh_token(user.id)

#         response = Response()

#         #Set a cookie with a key-value pair in browser and this refreshToken resides in Cookies section until and unless we need new access token
#         #Tis cookie is used to generate new access token when frontend needs new access token(eg-user has logout and previous access token was deleted.)
#         response.set_cookie(key='refreshToken', value=refresh_token, httponly=True)
#         print('\n' ,response.set_cookie(key='refreshToken', value=refresh_token, httponly=True))
#         response.data = {
#             'token': access_token
#         }

#         return response

class LoginAPIView(APIView):
    def post(self, request):
        user = User.objects.filter(email=request.data['email']).first()
        print('user:', user)
        if not user:
            raise APIException('Invalid credentials!')

        if not user.check_password(request.data['password']):
            raise APIException('Invalid-credentials!')

        #no need for qrcode authenticating
        if user.tfa_secret:
            return Response({
                'id': user.id
            })

        #generate secret using pyotp    
        secret = pyotp.random_base32()
        #if you open Scanner app and scan qrcode, You will prompt with issuer_name="Django Auth App"
        otpauth_url = pyotp.totp.TOTP(secret).provisioning_uri(issuer_name="Django Auth App")

        return Response({
            'id':user.id,
            'secret':secret,
            'otpauth_url':otpauth_url
        })    

class TwoFactorAPIView(APIView):
    def post(self, request):
        id=request.data['id']
        print(request.data)
        print('\n')
        user = User.objects.filter(id=id).first()
        print(user)
        print('\n')
        if not user:
            raise APIException('Invalid credentials!')
        
        #return user's tfa _secret.
        secret = user.tfa_secret if user.tfa_secret != None else request.data['secret']
        print('secret:', secret)

        if not pyotp.TOTP(secret).verify(request.data['code']):
            raise APIException('Invalid credentials!')

        print('\ntfa:',user.tfa_secret)    
        #for first time only this executes.
        if not user.tfa_secret:
            print('exectue')
            user.tfa_secret = secret
            user.save()

        print('\ntfa:',user.tfa_secret)    
 
        access_token = create_access_token(id)
        refresh_token = create_refresh_token(id)
        print('\n', access_token, refresh_token)
        response = Response()

        response.set_cookie(key='refreshToken', value=refresh_token, httponly=True)
        print('\n' ,response.set_cookie(key='refreshToken', value=refresh_token, httponly=True))
        # set data object to a token key-value.
        response.data = {
            'token': access_token
        }

        print(response.data)
        return response



#Bearer prefix is used in authorization header to make endpoint more secure.It's imp
#This View is used for authenticating User after User have logged in.
class UserAPIView(APIView):
    def get(self, request):
        #we have two values for Authorization header i.e header and e.....
        #see in Postman or frontend app
        auth = get_authorization_header(request).split()
        print('auth:',auth)

        if auth and len(auth) == 2:
            token = auth[1].decode('utf-8')
            #now token is decoded back to id of particular user
            #decodiing this id, now we make checks
            id = decode_access_token(token)

            user = User.objects.filter(pk=id).first()

            # {"id": , "name": "", "username": "", "email": ""}
            return Response(UserSerializer(user).data)

        raise AuthenticationFailed('unauthenticated')


#Used to Create New Access Token
class RefreshAPIView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get('refreshToken')
        id = decode_refresh_token(refresh_token)
        access_token = create_access_token(id)
        return Response({
            'token': access_token
        })


class LogoutAPIView(APIView):
    def post(self, _):
        response = Response()
        response.delete_cookie(key="refreshToken")
        response.data = {
            'message': 'success'
        }
        return response



class ForgotAPIView(APIView):
    def post(self, request):
       email=request.data['email']
       print(email)
       token = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(10))
       Reset.objects.create(
        email=email,
        token=token
       )
       url = "http://localhost:3000/reset/"+token
       send_mail(
            subject="Reset Your Password",
            message="Click <a href='%s'>here</a> to reset your Password!" % url,
            from_email="fromserver@example.com",
            recipient_list=[email]
       )
       return Response({
        "message": "success"
       })


class ResetAPIView(APIView):
    def post(self, request):
        data=request.data
        if data['password'] != data['password_confirm']:
            raise APIException("Password don't match!")   

        reset_password = Reset.objects.filter(token=data['token']).first()
        if not reset_password:
            raise APIException("Invalid link")
       
        user = User.objects.filter(email=reset_password.email).first()  
        if not user:
            raise APIException("User not found")

        user.set_password(data['password'])
        user.save()

        return Response({
            "message": "success",
        })    

from google.oauth2 import id_token        
from google.auth.transport.requests import Request as GoogleRequest

class GoogleAuthAPIView(APIView):
    def post(self ,request):
        token = request.data['token']
        googleUser = id_token.verify_token(token, GoogleRequest())

        if not googleUser:
            raise AuthenticationFailed("Unauthenticated")

        user = User.objects.filter(email=googleUser['email']).first()

        if not user:
            user =User.objects.create(
                first_name = googleUser['given_name'],
                last_name = googleUser['family_name'],
                username = f'{googleUser["given_name"]} {googleUser["family_name"]}',
                email=googleUser['email'],
                
            )   
            user.set_password(token)
            user.save() 

        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)
        print('\n', access_token, refresh_token)
        response = Response()

        response.set_cookie(key='refreshToken', value=refresh_token, httponly=True)
        print( response.set_cookie(key='refreshToken', value=refresh_token, httponly=True))
        # set data object to a token key-value.
        response.data = {
            'token': access_token
        }

        print(response.data)
        return response
