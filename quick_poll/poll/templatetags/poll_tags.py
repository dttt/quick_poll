from django import template

register = template.Library()

@register.filter(name="last_option")
def last_option(i):
    if i == "4":
        return " last_option"
    else:
        return ''
