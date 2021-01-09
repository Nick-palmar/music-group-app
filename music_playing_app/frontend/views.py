from django.shortcuts import render

# Create your views here.

def index(request, *args, **kwargs):
    # render the index template through the request
    return render(request, 'frontend/index.html')