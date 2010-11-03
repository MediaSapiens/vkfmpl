# encoding: utf-8

"""
The AJAX code generate by the template tag (see
:mod:`lastfm.templatetags.lastfm_widget`) doesn‚Äôt contact Last.fm directly, but
uses a Django view as proxy. The advantage of this is, that you can exactly
control what data your site gets. Another advantage is, that visitors can‚Äôt see
your Last.fm username by inspecting the HTML source of your site.

In addition to the view itself this module also defines some helper classes that
are responsible for handling the different types of charts (e.g. top tracks or
top artists).
"""
import logging
import urllib
from urllib2 import urlopen

from django.conf import settings 
from django.http import HttpResponse
from django.utils import simplejson as json
from django.views.decorators.cache import cache_page
from django.template import loader, Context
from django.shortcuts import render_to_response, get_object_or_404
from django.core.cache import cache
from plist.gadget.models import Playlist
from django.core import serializers
from django.utils.html import strip_tags, urlquote

API_KEY = '81954117af67fe8543204f45fa0717df'
COUNTRY = 'germany'

def get_user_list(request):
    latest_user_playlist = Playlist.objects.all().order_by('-pub_date')[:25]
    #result_user_playlist = json.dumps(latest_user_playlist)

    if not request.is_ajax():
        #http://webcloud.se/article/AJAX_in_Django_with_jQuery/
        #http://docs.djangoproject.com/en/dev/topics/serialization/
        json_serializer = serializers.get_serializer("json")()
        data = json_serializer.serialize(latest_user_playlist, ensure_ascii=False)
        return HttpResponse(data, mimetype='application/javascript')
    return render_to_response('default.html', { 'playlist_object': latest_user_playlist })


def save_to_playlist(request):
	if not request.is_ajax() or not request.method == "POST":
	      return HttpResponse("BAD")
	plist = Playlist.objects.get_or_create(title=strip_tags(request.POST.get('song')), mbid=strip_tags(request.POST.get('mbid')))
	#plist = created = Playlist.objects.get_or_create(title=request.POST.get('song'), mbid=request.POST.get('mbid'))
	return HttpResponse('ok')
	try:
	    indexes = request.POST.get('mbid')

	except IndexError:
	    pass
	except klass.DoesNotExist:
	    pass
	except AttributeError:
	    pass

	return HttpResponse()

def delete(request):
	plist = Playlist.objects.get(pk=strip_tags(request.POST.get('mbid')))
	try:
	    plist.delete()

	except IndexError:
	    pass
	except klass.DoesNotExist:
	    pass
	except AttributeError:
	    pass

	return HttpResponse()


def getCountyTopArtists(request):
	plist = Playlist.objects.all()
	result = TopArtiests(COUNTRY)
	jsonResult = result.get_data()
    #logging.debug(jsonResult)
	return render_to_response('default.html', { 'jsonData': jsonResult, 'plist': plist})

	
def get_plist(request):
	data = serializers.serialize('json', Playlist.objects.all(), fields=('title','mbid'))
	#return data
	return HttpResponse(data,mimetype='application/json')
	
def getTopTracks(request,name):
	result = TopTracks(name)
	jsonResult = result.get_data()	
	return HttpResponse(jsonResult,mimetype='application/json')
	

"""
top tracks:
http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=spain&api_key=b25b959554ed76058ac220b7b2e0a026
""" 
class TopTracks():
    """
	get top artiests of a country
	example url: http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=cher&api_key=b25b959554ed76058ac220b7b2e0a026
	"""
    def __init__(self, name, format='json'):
        
        var_key = 'var_' + name
        try: 
            self.data = cache.get(var_key)
            if self.data == None:
                url = 'http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=%s&api_key=%s&format=%s' % (urlquote(name), API_KEY, format)
                logging.debug(url)
                self.data = urlopen(url).read()
                cache.set(var_country, self.data, 3600)
        
        
        except Exception:
            pass
        
    def get_data(self):
        return self.data
 
class TopArtiests():
    """
	get top artiests of a country
	
	"""
    def __init__(self, country, format='json'):
        self.api_key = "81954117af67fe8543204f45fa0717df"
        var_country = 'var_' + country
        try: 
            self.data = cache.get(var_country)
            if self.data == None:
                url = 'http://ws.audioscrobbler.com/2.0/?method=geo.gettopartists&country=%s&api_key=%s&format=%s' % (country, API_KEY, format)
                #logging.debug(url)
                self.data = urlopen(url).read()
                cache.set(var_country, self.data, 3600)
        
        
        except Exception:
            pass
        
    def get_data(self):
        return self.data


 
