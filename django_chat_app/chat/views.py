from django.http import HttpResponseRedirect
from django.shortcuts import render
from .models import Chat, Message
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import logout
from django.http import JsonResponse
from django.core import serializers

@login_required(login_url='/login/')
def index(request):
    if request.method == 'POST':
        print("Received data " + request.POST['textmessage'] )
        myChat, created = Chat.objects.get_or_create(id=1)
        new_Message = Message.objects.create(text=request.POST['textmessage'], chat=myChat, author=request.user, receiver=request.user)
        serialized_obj = serializers.serialize('json', [new_Message])
        return JsonResponse(serialized_obj[1:-1], safe=False)
    chatMessages = Message.objects.filter(chat__id=1)
    return render(request, 'chat/index.html', {'username': request.user, 'messages': chatMessages})

def login_view(request):
    redirect = request.GET.get('next')
    if redirect != '/chat/': 
        redirect = '/chat/'
    if request.method == 'POST':
        user = authenticate(username=request.POST.get('username'), password=request.POST.get('password'))
        if user:
            login(request, user)
            return HttpResponseRedirect(request.POST.get('redirect'))
        else: 
            return render(request, 'auth/login.html', {'wrongPassword': True, 'redirect': redirect})
    return render(request, 'auth/login.html', {'redirect': redirect})

def register_view(request): 
    redirect = request.GET.get('next')
    if redirect == '/chat/': 
        redirect = '/chat/'
    if request.method == 'POST':
        if request.POST.get('password') == request.POST.get('password_repeat'):
            user = User.objects.create_user(username=request.POST.get('username'), email=request.POST.get('email'), password=request.POST.get('password'))
            user.save()
        else: 
            return render(request, 'auth/register.html', {'wrongPassword': True, 'redirect': redirect})
    return render(request, 'auth/register.html', {'redirect': redirect})

def logout_view(request):
    logout(request)
    return render(request, 'auth/logout.html', {'redirect': '/logout'})