# utility handler

import webapp2
import jinja2
import os
import logging

template_dir = os.path.join(os.path.dirname(__file__), '..', 'jinja_templates')
jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir), autoescape=True)

    
# webapp2.RequestHandler.__init__ calls webapp2.RequestHandler.initialize(self.initialize)
# So instead of overriding __init__ method, we can override the initialize.

# So the initialize method defined in Handler class get called by the __init__ method of 
# webapp2.RequestHandler class. Then, the Handler class' initialize at beginning calls 
# the webapp2.RequestHandler.initialize method which adds the basic 'request', 'response' and 'app'
# properties to object(self). Then we proceed to add our custom properties.

# initialize method will be called at every URL request the app routes.

class Handler(webapp2.RequestHandler):
    
	def initialize(self, *a, **kw):
		webapp2.RequestHandler.initialize(self, *a, **kw)

	def write(self, *a, **kw):
		self.response.out.write(*a, **kw)

	def render_str(self, template, **params):
		t = jinja_env.get_template(template)			
		return t.render(params)

	def render(self, template, **kw):
		self.write(self.render_str(template, **kw))

	def render_json(self, d):
		json_txt = json.dumps(d)
		self.response.headers['Content-Type'] = 'application/json; charset=UTF-8'
		self.write(json_txt)

	def fail_ajax(self, response_text=None):
		self.response.status_int = 400;
		self.write(response_text)

