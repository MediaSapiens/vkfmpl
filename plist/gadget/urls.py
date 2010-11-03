from django.conf.urls.defaults import *


urlpatterns = patterns('',
  (r'^$', 'plist.gadget.views.getCountyTopArtists'),
  #(r'^gcta/$', 'plist.gadget.views.get_country_top_artist'),
  #(r'^lastfm/$', 'plist.gadget.views.lastfm_data'),
  (r'^user_list/$','plist.gadget.views.get_user_list'),
  (r'^plist/$','plist.gadget.views.get_plist'),
  (r'^tracks/(?P<name>.*)','plist.gadget.views.getTopTracks'),
  (r'^save/','plist.gadget.views.save_to_playlist'),
  (r'^delete/','plist.gadget.views.delete'),
  #(r'^save/(?P<mbid>[A-Za-z0-9-_]*)/(?P<itemid>\d+)/','plist.gadget.views.save_to_playlist'),
  #(r'^save/test/99/','plist.gadget.views.save_to_playlist'),
   
  #(r'^lastfm/', 'lastfm.views.lastfm_data'),
  #
  #(r'^gadget/', 'plist.gadget.views.playlist'),
)
