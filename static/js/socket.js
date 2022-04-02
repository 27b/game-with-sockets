export default class Socket {
    constructor(socket) {
        this.socket = socket
    }

    /**
     * Listen message
     * @param {string} message 
     * @param {callback} callback
     */
    on(message, callback) {
        this.socket.on(message, data => {
            return callback(data)
        })
    }

    /**
     * Emit message
     * @param {string} message 
     * @param {Array} data
     */
    emit(message, data) {
        return this.socket.emit(message, data)
    }
}