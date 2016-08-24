from flask.ext.api import FlaskAPI
from flask.ext.api.decorators import set_renderers
from flask.ext.api.renderers import JSONRenderer
from slabot.bot import SlackBot

app = FlaskAPI(__name__)

def build_bot():
    bot = SlackBot('xoxb-71611805235-DM495SsJM8q6E0ZCXFB3Aih4', username='lilithbot', channel='services')
    return bot

@app.route("/")
@set_renderers(JSONRenderer)
def slack_index():
    build_bot().send_message('testando')
    return {'success': 'true'}

if __name__ == "__main__":
    app.run(debug=True)
