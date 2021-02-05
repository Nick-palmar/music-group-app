from django.shortcuts import render
from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response

# Create views here.
class RoomView(generics.CreateAPIView):
    # get a queryset of everything in the room DB as well as the serialized information from the DB
    queryset = Room.objects.all 
    serializer_class = RoomSerializer


# create a create room view class that inherits from APIView to allow us to change request mappings
class CreateRoomView(APIView):
    # create a variable for the class CreateRoomSerializer
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        # check if the user has a session, if not, create one
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        # get the unserialized data from the request and turn it into serialized, usable data
        serializer = CreateRoomView.serializer_class(data=request.data)

        # check if the parameters of CreateRoomSerializer are valid
        if serializer.is_valid():
            # get the data from the serializer
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key

            # check if a queryset exists with the same host key
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                # keep the same host key
                room = queryset[0]
                # update the remaining settings
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                # save the updated room model
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])

                # return a response showing that the post request is ok 
                return Response(RoomSerializer(room).data, status = status.HTTP_200_OK)
            else:
                # create a new room if the host key DNE
                room = Room(host = host, guest_can_pause = guest_can_pause, votes_to_skip = votes_to_skip)
                room.save()
                # return a response to show the creation 
                return Response(RoomSerializer(room).data, status = status.HTTP_201_CREATED)

            # if neither a room is create nor a updated, send a message for bad request
            return Response(RoomSerializer(room).data, status=status.HTTP_400_BAD_REQUEST)

class GetRoom(APIView):
    serializer_class = RoomSerializer
    
    def get(self, request, format=None):
        # get the room code 
        code = self.request.GET.get('code')
        # check if the room has a code associated
        if code != None:
            # get the room with the code associaed
            room = Room.objects.filter(code=code)[0]
            if room != None:
                # serialize the room 
                data = self.serializer_class(room).data
                # check if the current user is the host
                data['is_host'] = self.request.session.session_key == room.host

                # send the data if there is a room
                return Response(data, status=status.HTTP_200_OK)
            # no room found
            return Response({'Room Not Found': 'Invalid Room Code'}, status=status.HTTP_404_NOT_FOUND)
        # no code passed
        return Response({'Bad Request': 'No Code Passed'}, status=status.HTTP_400_BAD_REQUEST)
