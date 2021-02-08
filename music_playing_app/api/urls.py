from django.urls import path
from .views import RoomView, CreateRoomView, GetRoom, JoinRoom, CurrentRoom, LeaveRoom

urlpatterns = [
    path('room', RoomView.as_view()),
    path('create-room', CreateRoomView.as_view()),
    path('get-room', GetRoom.as_view()),
    path('join-room', JoinRoom.as_view()),
    path('in-room', CurrentRoom.as_view()),
    path('leave-room', LeaveRoom.as_view()),
]