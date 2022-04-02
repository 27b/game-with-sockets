export default class User {
    constructor(Socket) {
        this.socket = Socket;
        this.credentials = {
            username: null,
            secret_key: null
        }
    }

    /**
     * Private method to set username.
     * @param {string} username 
     */
    set_username(username) {
        this.credentials['username'] = username;
    }

    /**
     * Private method to set secret_key.
     * @param {string} secret_key 
     */
    set_secret_key(secret_key) {
        this.credentials['secret_key'] = secret_key;
    }

    /**
     * Send message with credentials.
     * @param {string} address
     * @param {Array} data
     */
    emit_with_credentials(address, data) {
        this.socket.emit(address, {
            ...this.credentials,
            ...{data: data},
        });
        this.socket.on(address, data => {
            return data;
        });
    }

    /**
     * Get position of actual user.
     * @returns {Array}
     */
    get_position() {
        return this.emit_with_credentials_and_get_result("user_position", {});
    }

    /**
     * Check if the username is valid.
     */
    check_if_username_is_valid() {
        let username = prompt("Username:");
        socket.emit("new_user", username);
    }

    /**
     * Send new position of the user.
     * @param {int} x 
     * @param {int} y 
     */
    move_to(x, y) {
        this.socket.emit("user_direction", {
            username: this.username,
            secret_key: this.secret_key,
            point: [x, y],
        });
    }
}
