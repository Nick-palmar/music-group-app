from django.shortcuts import render
from rest_framework import generics
from .serializers import RoomSerializer
from .models import Room

# Create your views here.

class RoomView(generics.CreateAPIView):
    # get a queryset of everything in the room DB as well as the serialized information from the DB
    queryset = Room.objects.all 
    serializer_class = RoomSerializer

