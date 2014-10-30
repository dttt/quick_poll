from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
    url(r'^(?P<random_id>[a-zA-Z0-9-]+)/?$', 'poll.views.show', name='show'),
    url(r'^$', 'poll.views.create', name='create'),
)
