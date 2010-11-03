from django.db import models

# Create your models here.
class Playlist(models.Model):
    title = models.CharField(max_length=250)
    #slug = models.SlugField(unique=True)
    mbid = models.CharField(max_length=100)
    pub_date = models.DateTimeField(auto_now_add=True)
    
    def __unicode__(self):
        return self.title
    class Meta:
        ordering = ['-pub_date']
    
    #@models.permalink
    #def get_absolute_url(self):
    #    return ('uni.gadget.get_entry', (), { 'slug': self.slug })
    #get_absolute_url = models.permalink(get_absolute_url)

    

#class Choice(models.Model):
#    poll = models.ForeignKey(Poll)
#    choice = models.CharField(max_length=200)
#    votes = models.IntegerField()
