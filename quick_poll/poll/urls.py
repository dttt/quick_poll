from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
    url(r'^(?P<random_id>[a-zA-Z0-9-]+)/?$', 'poll.views.show', name='show'),
    url(r'^(?P<random_id>[a-zA-Z0-9-]+)/result/?$', 'poll.views.result', name='result'),
    url(r'^(?P<random_id>[a-zA-Z0-9-]+)/vote/?$', 'poll.views.vote', name='vote'),
)
