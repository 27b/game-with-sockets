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

socketio = SocketIO(app)

map = Map()

rows = 30

cols = 30

n_value = 0

map.set_map(rows, cols, value=n_value)


# Aux functions
def emit_map_status_to_clients():
    '''Sends the map state (list) values to all users.'''
    map_data = map.get_map()
    socketio.emit('map', map_data, broadcast=True)

def emit_user_list_to_clients():
    '''Sends the user lists to all users.'''
    user_list = [user['username'] for user in users]
    socketio.emit('users', user_list, broadcast=True)


# Sockets
@socketio.on('new_user')
def register_new_user(username: str):
    '''If the username does not exist, create a new user and send the
    data.
    
    Args:
        username: str

    '''
    if User.check_if_username_valid(username):
        x_and_y = User.generate_random_position(rows, cols)
        new_user = {
            'username': username,
            'secret_key': uuid4().hex,
            'position': x_and_y
        }
        User.add_user_in_database(new_user)
        map.set_point_in_map(x_and_y[0], x_and_y[1], username)
        emit('new_user', new_user)
        emit_map_status_to_clients()
    else:
        emit('new_user', 'Username in use.')


@socketio.on('user_is_authenticated')
def user_is_authenticated(data):
    '''Check if the username and secret key of the client is
    still stored on the server.
    '''
    username = data['username']
    secret_key = data['secret_key']
    credentials = User.check_user_credentials(username, secret_key)
    if credentials:
        emit('user_is_authenticated', True)
    else:
        emit('user_is_authenticated', False)


@socketio.on('map_print_instructions')
def send_map_printing_instructions():
    '''Send the dimensions of the map to the client.'''
    map_data = {'cols': cols, 'rows': rows}
    emit('map_print_instructions', map_data, broadcast=True)


@socketio.on('map')
def send_map_state():
    '''Send the map state to the client.'''
    map_data = map.get_map()
    emit('map', map_data, broadcast=True)


@socketio.on('user_direction')
def user_direction(data):
    '''If the credentials are valid, the server receive the new
    coordenates and clean the old point, after emit the new
    coordenate to the user and emit the map to all users.

    Args:
        data: dict with username, secret_key, and point (list of two values)
    '''
    try:
        username = data['username']
        secret_key = data['secret_key']
        x, y = data['data']['point']
        credentials = User.check_user_credentials(username, secret_key)
        if credentials and map.check_if_point_in_map(x, y):
            if map.check_if_point_in_use(x, y):
                other_user = map.get_point(x, y)
                if username != other_user:
                    User.remove_user_in_database(other_user)
                    emit_user_list_to_clients()
            user = users[int(credentials)]
            old_x, old_y = user['position']
            map.set_point_in_map(old_x, old_y, n_value)  # Clean old point in map
            user['position'] = [x, y]                    # Set point in user data
            map.set_point_in_map(x, y, user['username']) # Set new point in map
            emit('user_direction', [x, y])               # Send new values to user
            emit_map_status_to_clients()                 # Update map for everyone
    except Exception as error:
        print(error)
        emit('error', str(error))

# Endpoints
@app.route('/', methods=['GET'])
def index():
    '''Render the index page and load the javascript to connect the
    user with the sockets.'''
    return render_template('index.html')


if __name__ == '__main__':
    socketio.run(app)
