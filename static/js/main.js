import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import Map from './map.js';
import User from './user.js';


const socket = io();

const container = document.getElementById("container");

const user = new User(socket);
const map = new Map(container, socket);

const username = localStorage.getItem('username')
const secret_key = localStorage.getItem('secret_key')


if (username && secret_key) {
    user.emit_with_credentials('user_is_authenticated', {})
} else {
    user.create_login_input();
}


// Sockets listening
socket.on('error', message => {
    console.log(message)
})

socket.on("new_user", new_user => {
    if (new_user != "Username in use.") {
        localStorage.setItem('username', new_user["username"]);
        localStorage.setItem('secret_key', new_user["secret_key"]);
        localStorage.setItem('position', JSON.stringify(new_user["position"]));
    } else {
        this.create_login_input();
    }
});

socket.on('user_is_authenticated', bool => {
    if (bool == false) {
        user.create_login_input();
    } else {
        console.log('The user has been logged.')
    }
})

socket.on('user_direction', position => {
    localStorage.setItem('position', JSON.stringify(position));
})

socket.on("map", data => {
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
});

socket.on("map_print_instructions", data => {
    const cols = data["cols"];
    const rows = data["rows"];
    const row = document.createElement("div");

    console.log(`Loading map with ${cols} columns and ${rows} rows`)

    for (let i = 0; i < rows; i++) {
        row.appendChild(document.createElement("div"));
    }

    for (let i = 0; i < cols; i++) {
        let new_row = row.cloneNode(true)
        container.appendChild(new_row);
    }
});


// Events
document.addEventListener("keydown", event => {        
    if (localStorage.getItem('username') !== null && 
        localStorage.getItem('secret_key') !== null) {
        let [x, y] = JSON.parse(localStorage.getItem('position'))

        if (event.code == 'ArrowUp') {
            user.move_to(x, y-1)
        }
        else if (event.code == 'ArrowDown') {
            user.move_to(x, y+1)
        }
        else if (event.code == 'ArrowLeft') {
            user.move_to(x-1, y)
        }
        else if (event.code == 'ArrowRight') {
            user.move_to(x+1, y)
        }
        else {
            // TODO
        }
    }
});
