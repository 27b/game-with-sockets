from random import randint


users = []


class User:

    @staticmethod
    def check_if_username_valid(username: str) -> bool:
        '''Check if the username is valid to assing.
        
        Args:
            username: The username to assing.

        Returns:
            bool: If the username is valid.
        '''
        for user in users:
            if user['username'] == username:
                return False
        return True

    @staticmethod
    def check_user_credentials(username: str, secret_key: str) -> bool:
        for index, user in enumerate(users):
            if user['username'] == username and \
               user['secret_key'] == secret_key:
                return str(index)
        return False


    @staticmethod
    def add_user_in_database(user: dict[str, str, list]) -> None:
        '''Add user dict in the list of users.
        
        Args:
            dict: With username and secret_key.
        '''
        users.append(user)

    @staticmethod
    def generate_random_position(rows: int, cols: int) -> list[int, int]:
        '''Generate a list with two values, [0] is x and [1] is y,
        this values are generate between 0 and row or column.

        Args:
            rows: int
            cols: int

        Returns:
            list: [x, y] 
        '''
        x = randint(0, cols) # Columns size == X
        y = randint(0, rows) # Rows size == Y
        return [x, y]


if __name__ == '__main__': 
    random_list_x_and_y = User.generate_random_position(15, 15)
    assert random_list_x_and_y[0] >= 0
    assert random_list_x_and_y[1] >= 0
    assert random_list_x_and_y[0] <= 15
    assert random_list_x_and_y[1] <= 15
