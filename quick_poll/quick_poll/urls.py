from django.conf.urls import patterns, include, url
from django.contrib import admin
admin.autodiscover()

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', 'poll.views.home', name='home'),
    url(r'^poll/', include('poll.urls', namespace='poll')),
    url(r'^ajax/create/', 'poll.views.create', name='ajax-create'),
)
