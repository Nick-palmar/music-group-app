from rest_framework import serializers
from .models import Room

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        # this is the data that will be return as a json file
        model = Room
        fields = ('id', 'code', 'host', 'guest_can_pause', 'votes_to_skip', 'created_at')

class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        # serializer that is created when the post request for create room is sent
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip')
