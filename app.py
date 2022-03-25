from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit
from dotenv import load_dotenv
from os import getenv
from uuid import uuid4

# Config
load_dotenv()

app = Flask(__name__, static_url_path='/')

app.config['SECRET_KEY'] = getenv('SECRET_KEY')
app.config['DEBUG'] = eval(getenv('DEBUG'))
app.config['PORT'] = 5000

socketio = SocketIO(app)

user_list = []


# Auxiliary functions
def check_if_username_valid(username: str) -> bool:
    '''Check if the username is valid to assing.
    
    Args:
        username: The username to assing.

    Returns:
        bool: If the username is valid.
    '''
    for user in user_list:
        if user['username'] == username:
            return False
    return True

def add_user_in_database(user: dict[str, str]) -> None:
    '''Add user dict in the list of users.
    
    Args:
        dict: With username and secret_key.
    
    Returns:
        None
    '''
    user_list.append(user)


# Sockets
@socketio.on('new_user')
def register_new_user(username: str):
    if check_if_username_valid(username):
        new_user = {
            'username': username,
            'secret_key': uuid4().hex
        }
        add_user_in_database(new_user)
        emit('new_user', new_user)
    else:
        emit('new_user', 'Username in use.')

    print(user_list)


@socketio.on('message')
def handle_message(data: str):
    print('received message: ' + data)


# Endpoints
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


if __name__ == '__main__':
    socketio.run(app)
