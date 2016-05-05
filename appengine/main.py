
import webapp2

from utility_handler import Handler

class MainHandler(Handler):
    def get(self):
        return self.render('index.html')

app = webapp2.WSGIApplication([
    ('/', MainHandler)
], debug=True)
