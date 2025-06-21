from django.shortcuts import render
from django.contrib.auth.decorators import login_required

def home(request):
    """
    Home page view.
    """
    return render(request, 'home.html') 