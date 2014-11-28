import json
from django.shortcuts import render, get_object_or_404
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect, HttpResponse
from django.template.loader import render_to_string
from django.template.response import TemplateResponse
from poll.models import Poll, Option


def home(request):
    if request.is_ajax():
        return TemplateResponse(request, 'create_poll.html')

    return render(request, 'home.html')


def create(request):
    if request.is_ajax():
        poll_content = request.POST.get('poll', None)
        poll_options = json.loads(request.POST.get('options', None))
        poll = Poll(content=poll_content)
        poll.save()
        for option in poll_options:
            poll.option_set.create(content=option)

        data_json = {'html' :render_to_string('show_ajax.html', {'poll': poll}),
                            'url': poll.get_absolute_url()}

        return HttpResponse(json.dumps(data_json), mimetype='application/json')



def show(request, random_id):
    poll = Poll.objects.get(random_id=random_id)
    if request.is_ajax():
        return TemplateResponse(
            request, 'show_ajax.html', {'poll': poll})

    return render(request, 'show.html', {'poll': poll})


def get_result_json(poll):
    options = poll.option_set.all()
    data_json = []
    for option in options:
        data_json.append({'content': option.content, 'id': option.id, 'voted': option.voted})
    return data_json


def vote(request, random_id):
    if request.is_ajax():
        poll = Poll.objects.get(random_id=random_id)
        voted_option = Option.objects.get(id=request.POST.get('voted'))
        voted_option.upvote()
        return HttpResponse(json.dumps(get_result_json(poll)),
            mimetype='application/json')

def result(request, random_id):
    poll = Poll.objects.get(random_id=random_id)
    if request.is_ajax():
        return HttpResponse(json.dumps(get_result_json(poll)),
            mimetype='application/json')

