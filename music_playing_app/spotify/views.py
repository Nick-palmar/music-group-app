from django.shortcuts import render
from .credentials import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response

class AuthURL(APIView):
    def get(self, request, format=None):
        # set the scopes for what functionality you will be getting from the spotify API
        # from: https://developer.spotify.com/documentation/general/guides/scopes/
        scopes = 'user-read-playback-state user-modify-playback-state user-read-current-playing'

        # create a url which specifies the scopes for the API, the response type (we will receive a code), the redirect uri and the client id env variable
        url = Request('GET', 'https://accounts.spotify.com/authorize', params = {
            'scope': scopes,
            'response_type': 'code', 
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url

        # return the url to the frontend to make a fetch request
        return Response({'url': url}, status=status.HTTP_200_OK)

class AuthRedirect(APIView):
    def get(self, request, format=None):
        # get the code from spotify 

        # send a post request to the tokens spotify (not mine) endpoint given the code and other relevant api info

        # retreive the values of the json response from spotify

