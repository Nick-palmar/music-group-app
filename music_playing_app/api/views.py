from django.shortcuts import render
from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

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
        
        print(type(request.data))
        # get the unserialized data from the request and turn it into serialized, usable data
        serializer = self.serializer_class(data=request.data)

        # check if the parameters of CreateRoomSerializer are valid
        if serializer.is_valid():
            print(type(serializer.data))
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

                # add the room code to the current user's session
                self.request.session['room_code'] = room.code

                # return a response showing that the post request is ok 
                return Response(RoomSerializer(room).data, status = status.HTTP_200_OK)
            else:
                # create a new room if the host key DNE
                room = Room(host = host, guest_can_pause = guest_can_pause, votes_to_skip = votes_to_skip)
                room.save()
                # add the room code to the current user's session
                self.request.session['room_code'] = room.code
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
            room = Room.objects.filter(code=code)
            if room != None and len(room) >= 1:
                # get the room element at index 0
                room = room[0]
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

class JoinRoom(APIView):
    def post(self, request, format=None):
        # make sure the current user has a session
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        # get the code from the post request
        print(request.data)
        code = request.data.get('code')

        if code != None:
            # find a room that matches the code
            room_search = Room.objects.filter(code=code)
            if len(room_search) > 0:
                room = room_search[0]
                # add the room code to the current user's session
                self.request.session['room_code'] = code
                return Response({'Message': 'Room Joined'}, status=status.HTTP_200_OK)
            
            return Response({'Room not found': 'Invalid, code not found'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'Bad Request': 'Invalid room request made'}, status=status.HTTP_400_BAD_REQUEST)

class CurrentRoom(APIView):
    
    def get(self, request, format=None):
        # make sure the current user has a session
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
            return JsonResponse({'Not in session': 'Leave person at home page'}, status=status.HTTP_404_NOT_FOUND)
        
        # check if the user has a session but is not in a room 
        code = self.request.session.get('room_code')
        if code != None:
            return JsonResponse({"code": code}, status=status.HTTP_202_ACCEPTED)
        else:
            return JsonResponse({'Not in session': 'Leave person at home page'}, status=status.HTTP_404_NOT_FOUND)

class LeaveRoom(APIView):
    def get(self, request, format=None):
        # delete the person's current room code from the session
        try:
            del self.request.session['room_code']
            # check if the person is the room host, if they are delete the room 
            person_id = self.request.session.session_key
            find_rooms = Room.objects.filter(host=person_id)
            if find_rooms.exists():
                room = find_rooms[0]
                room.delete()
            print("No exception")
            return Response({"Room left": "Room has been left sucessfully"}, status=status.HTTP_200_OK)
        except:
            # the room code was not found in the current session_key
            print("Exception")
            return Response({"Session not found": "Not currently in a room"}, status=status.HTTP_404_NOT_FOUND)