from django.db import models
from django.contrib.auth.models import User
import string
import random
from django.core.urlresolvers import reverse

def generate_id(size=6, chars=string.ascii_uppercase + string.digits):
    random_id = ''.join(random.choice(chars) for _ in range(size))
    existed = Poll.objects.get(random_id=random_id)
    if not existed:
        return random_id
    else:
        generate_id()


class Poll(models.Model):
    content = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)
    creator = models.ForeignKey(User, null=True, blank=True)
    random_id = models.CharField(max_length=6)
    closed_date = models.DateTimeField(null=True, blank=True)

    def __unicode__(self):
        return self.random_id

    def get_absolute_url(self):
        return self.random_id


class Option(models.Model):
    content = models.TextField()
    voted = models.IntegerField(default=0)
    poll = models.ForeignKey(Poll)

    def upvote(self):
        self.voted += 1
        self.save()

    def __unicode__(self):
        return self.content
