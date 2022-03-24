from flask import Flask
from dotenv import load_dotenv
from os import getenv


load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = getenv('SECRET_KEY')
app.config['DEBUG'] = eval(getenv('DEBUG'))
app.config['PORT'] = 5000


@app.route('/', methods=['GET'])
def index():
    return 'Hello World'


if __name__ == '__main__':
    app.run()
