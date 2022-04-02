class Map:

    def __init__(self) -> None:
        self.map = []
        self.value = None
    
    def set_map(self, rows: int, cols: int, value=0) -> None:
        self.value = value
        self.map = [
            [value for i in range(cols)] for j in range(rows)
        ]
    
    def get_map(self) -> list:
        return self.map

    def check_if_point_in_map(self, x: int, y: int) -> bool:
        if x >= 0 and x <= len(self.map) and \
           y >= 0 and y <= len(self.map[0]):
            return True
        return False
    
    def check_if_point_in_use(self, x: int, y: int) -> bool:
        if self.check_if_point_in_map(x, y):
            if self.map[y][x] != self.value:
                return True
        return False

    def set_point_in_map(self, x: int, y: int, value) -> bool:
        if self.check_if_point_in_map(x, y):
            self.map[y][x] = value
            return True
        return False


if __name__ == '__main__':
    # Create map
    map = Map()
    map.set_map(10, 10, value=None)

    # Check if point in map
    print(map.check_if_point_in_map(0, 0))        # True
    print(map.check_if_point_in_map(0, -1))       # False

    # Set point in map
    print(map.set_point_in_map(0, 0, 'User 1'))   # True
    print(map.set_point_in_map(0, 2, 'User 2'))   # True

    print(map.set_point_in_map(0, 99, 'User 3'))  # False
    print(map.set_point_in_map(0, -99, 'User 3')) # False

    print(map.set_point_in_map(0, 0, ':D'))       # True
    print(map.set_point_in_map(1, 1, ':)'))       # True

    map.map[0][2] = 99

    for row in map.map:
        print(row)