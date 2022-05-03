export default class User {
    constructor(socket) {
        this.socket = socket;
    }

    /**
     * Return the credentials from localStorage.
     */
    get_credentials() {
        return {
            username: localStorage.getItem('username'),
            secret_key: localStorage.getItem('secret_key')
        }
    }

    /**
     * Send message with credentials.
     * @param {string} address
     * @param {Array} data
     */
    emit_with_credentials(address, data) {
        this.socket.emit(address, {
            ...this.get_credentials(),
            ...{data: data},
        });
    }

    /**
     * Check if the username is valid.
     */
    create_login_input() {
        let username = prompt("Username:");
        this.socket.emit("new_user", username);
    }

    /**
     * Send new position of the user.
     * @param {int} x 
     * @param {int} y 
     */
    move_to(x, y) {
        this.emit_with_credentials("user_direction", {
            point: [x, y],
        });
    }
}
