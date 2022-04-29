export default class Map {
    constructor(container, socket) {
        this.container = container
        this.map_instructions = this.set_map(socket);
        this.map = this.get_map_state(socket);
    }

    /**
     * Get the map instruction (cols and rows) and print the map.
     */
    set_map(socket) {
        socket.emit("map_print_instructions", () => {});
    }

    /**
     * Set the map state, is used in the get_map_state method to update
     * the values in the map.
     * @param {Array} data 
     */
    set_map_state(data) {
        const container = this.container
        const username = localStorage.getItem('username')
        const map = data;

        console.log(data)

        for (let y = 0; y < map.length; y++) {
            const row = container.children[y];

            for (let x = 0; x < row.children.length; x++) {
                const tile = row.children[x];
                const tile_state = map[x][y];

                if (tile_state) {
                    if (tile_state == username) {
                        tile.innerHTML = `
                        <div class="green" title="${tile_state}">
                            👀 <span class="hat"></span>
                        </div>`;
                    } else {
                        tile.innerHTML = `
                        <div class="red" title="${tile_state}">
                            👺
                        </div>`;
                    }
                } else {
                    tile.innerHTML = " ";
                }
            }
        }
    }

    /**
     * Get the map state and send to set_map_state to print in the screen.
     * @param {object} socket 
     */
    get_map_state(socket) {
        socket.emit("map", () => {});
    }
}
