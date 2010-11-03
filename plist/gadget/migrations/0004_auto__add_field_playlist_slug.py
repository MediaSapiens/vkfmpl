# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding field 'Playlist.slug'
        db.add_column('gadget_playlist', 'slug', self.gf('django.db.models.fields.SlugField')(default='', max_length=50, unique=True, db_index=True), keep_default=False)


    def backwards(self, orm):
        
        # Deleting field 'Playlist.slug'
        db.delete_column('gadget_playlist', 'slug')


    models = {
        'gadget.playlist': {
            'Meta': {'object_name': 'Playlist'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'mbid': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'pub_date': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '50', 'unique': 'True', 'db_index': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '250'})
        }
    }

    complete_apps = ['gadget']
