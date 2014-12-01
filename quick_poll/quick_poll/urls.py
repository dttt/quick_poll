from django.conf.urls import patterns, include, url
from django.contrib import admin
admin.autodiscover()

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'poll.views.home', name='home'),
    url(r'^create', 'poll.views.create', name='create'),
    url(r'^(?P<random_id>[a-zA-Z0-9-]+)/?$', 'poll.views.show', name='show'),
    url(r'^(?P<random_id>[a-zA-Z0-9-]+)/result/?$',
        'poll.views.result', name='result'),
    url(r'^(?P<random_id>[a-zA-Z0-9-]+)/vote/?$',
        'poll.views.vote', name='vote'),
)
