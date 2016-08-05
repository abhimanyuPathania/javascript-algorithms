
import webapp2

from utility_handler import Handler

class SortingHandler(Handler):
	def get(self):
		return self.render('sorting.html')

class MainHandler(Handler):
    def get(self):
        return self.render('index.html')

app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/sorting', SortingHandler)
], debug=True)
