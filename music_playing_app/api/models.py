from django.db import models
import string
import random

def gen_random_unique_code():
    # set a length for the password
    length = 6

    # loop until a random, unique password has been generated
    while True:
        code = "".join(random.choices(string.ascii_uppercase, k = length))
        if Room.objects.filter(code = code).count() == 0:
            break

    return code

# Create your models here.
class Room(models.Model):
    # store a code with many characters
    code = models.CharField(max_length = 8, default = gen_random_unique_code, unique = True)
    # create a host that can only make one room
    host = models.CharField(max_length = 50, unique = True)
    # create permissions for guests that can pause the music
    guest_can_pause = models.BooleanField(null = False, default = False)
    # store the amount of votes to skip a song
    votes_to_skip = models.IntegerField(null = False, default = 1)
    # store info about room creation time
    created_at = models.DateTimeField(auto_now_add = True)

  
