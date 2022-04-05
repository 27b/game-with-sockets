from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from dotenv import load_dotenv
from os import getenv
from uuid import uuid4
from user import User, users
from map import Map


load_dotenv()

app = Flask(__name__, static_url_path='/')

app.config['SECRET_KEY'] = getenv('SECRET_KEY')

app.config['DEBUG'] = eval(getenv('DEBUG'))

app.config['PORT'] = 5000

socketio = SocketIO(app)


map = Map()

rows = 15

cols = 15

n_value = 0

map.set_map(rows, cols, value=n_value)


# Aux functions
def send_map_status_to_clients():
    map_data = map.get_map()
    socketio.emit('map', map_data, broadcast=True)


# Sockets
@socketio.on('new_user')
def register_new_user(username: str):
    if User.check_if_username_valid(username):
        new_user = {
            'username': username,
            'secret_key': uuid4().hex,
            'position': User.generate_random_position(rows, cols)
        }
        User.add_user_in_database(new_user)
        emit('new_user', new_user)
    else:
        emit('new_user', 'Username in use.')


@socketio.on('map_print_instructions')
def map_print_instructions():
    map_data = {'cols': cols, 'rows': rows}
    emit('map_print_instructions', map_data, broadcast=True)


@socketio.on('map')
def map_print_instructions():
    map_data = map.get_map()
    emit('map', map_data, broadcast=True)


@socketio.on('user_direction')
def user_direction(data):
    username = data['username']
    secret_key = data['secret_key']
    x, y = data['data']['point']
    credentials = User.check_user_credentials(username, secret_key)
    if credentials and map.check_if_point_in_map(x, y):
        user = users[int(credentials)]
        old_x = user['position'][0]
        old_y = user['position'][1]
        map.set_point_in_map(old_x, old_y, n_value)  # Clean old point in map
        user['position'] = [x, y]                    # Set point in user data
        map.set_point_in_map(x, y, user['username']) # Set new point in map
        emit('user_direction', [x, y])               # Send new values to user
        send_map_status_to_clients()                 # Update map for everyone


# Endpoints
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


if __name__ == '__main__':
    socketio.run(app)
