import json
from django.shortcuts import render

from poll.models import Poll


def home(request):
    #function = Function()
    #form = UserForm(request.POST)
    return render(request, 'home.html')#, {'form': form})


def create(request):
    if request.method == "POST":
        poll_content = request.POST.get('poll_content')
        poll = Poll(content=poll_content)
        poll.save()
        poll_options = json.loads(request.POST.get('options'))
        for option in poll_options:
            poll.option_set.create(content=option)
        return None


def show(request):
    random_id = request.GET.get('random_id')
    poll = Poll.objects.get(random_id=random_id)
    return render(request, 'show.html', {'poll': poll})


def vote(request):
    if request.method == "POST":
        poll = Poll.objects.get(random_id=request.GET.get('random_id'))

