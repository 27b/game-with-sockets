import Socket from "./socket";

export default class Map {
    constructor(id, socket) {
        this.element_id = id;
        this.map_instructions = this.set_map(socket);
        this.map = this.get_map_state(socket);
    }

    /**
     * Get the map instruction (cols and rows) and print the map.
     */
    set_map(socket) {
        const container = document.getElementById(this.element_id);

        socket.emit("map_print_instructions", () => {});

        socket.on("map_print_instructions", (data) => {
            const cols = data["cols"];
            const rows = data["rows"];
            const row = document.createElement("div");

            console.log(`Loading map with ${cols} columns and ${rows} rows`)

            for (let i = 0; i < cols; i++) {
                row.appendChild(document.createElement("div"));
            }

            for (let i = 0; i < rows; i++) {
                let new_row = row.cloneNode(true)
                container.appendChild(new_row);
            }
        });
    }

    /**
     * Set the map state, is used in the get_map_state method to set
     * the data values in the map.
     * @param {Array} data 
     */
    set_map_state(data) {
        const container = document.getElementById(this.element_id);
        const map = data;

        console.log(map);

        for (let y = 0; y < map.length; y++) {
            const row = container.children[y];

            for (let x = 0; x < row.children.length; x++) {
                const tile = row.children[x];
                const tile_state = map[x][y];

                if (tile_state) {
                    tile.innerHTML = tile_state;
                } else {
                    tile.innerHTML = "0";
                }
            }
        }
    }

    /**
     * Get the map state and send to set_map_state to print in the screen.
     * @param {Socket} socket 
     */
    get_map_state(socket) {
        socket.emit("map", () => {});

        socket.on("map", (data) => {
            console.log(data);
            this.set_map_state(data);
        });
    }
}
