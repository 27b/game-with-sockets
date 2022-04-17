export default class User {
    constructor(socket) {
        this.socket = socket;
        this.credentials = {
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
            ...this.credentials,
            ...{data: data},
        });
    }

    /**
     * Check if the username is valid.
     */
    check_if_username_is_valid() {
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

        this.socket.on('user_direction', position => {
            localStorage.setItem('position', JSON.stringify(position))
            console.log(position)
        })
    }
}
