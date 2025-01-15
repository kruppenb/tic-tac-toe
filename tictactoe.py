import random
import time
from typing import List, Tuple, Optional

class TicTacToe:
    def __init__(self):
        self.board = [[' ' for _ in range(3)] for _ in range(3)]
        self.scores = {'X': 0, 'O': 0, 'Draw': 0}  # X: Human, O: Computer
        
    def display_board(self):
        """Display the current game board with coordinates."""
        print('\n     1   2   3')
        print('   +---+---+---+')
        for i, row in enumerate(['A', 'B', 'C']):
            print(f' {row} | {" | ".join(self.board[i])} |')
            print('   +---+---+---+')
        print()

    def is_valid_move(self, row: int, col: int) -> bool:
        """Check if the move is valid."""
        return 0 <= row < 3 and 0 <= col < 3 and self.board[row][col] == ' '

    def make_move(self, row: int, col: int, player: str) -> bool:
        """Make a move on the board."""
        if self.is_valid_move(row, col):
            self.board[row][col] = player
            return True
        return False

    def check_winner(self) -> Optional[str]:
        """Check if there's a winner or draw."""
        # Check rows and columns
        for i in range(3):
            if self.board[i][0] == self.board[i][1] == self.board[i][2] != ' ':
                return self.board[i][0]
            if self.board[0][i] == self.board[1][i] == self.board[2][i] != ' ':
                return self.board[0][i]

        # Check diagonals
        if self.board[0][0] == self.board[1][1] == self.board[2][2] != ' ':
            return self.board[0][0]
        if self.board[0][2] == self.board[1][1] == self.board[2][0] != ' ':
            return self.board[0][2]

        # Check for draw
        if all(self.board[i][j] != ' ' for i in range(3) for j in range(3)):
            return 'Draw'

        return None

    def get_optimal_move(self) -> Tuple[int, int]:
        """Get the best possible move for the computer."""
        best_score = float('-inf')
        best_move = None

        for i in range(3):
            for j in range(3):
                if self.board[i][j] == ' ':
                    self.board[i][j] = 'O'
                    score = self.minimax(0, False)
                    self.board[i][j] = ' '
                    
                    if score > best_score:
                        best_score = score
                        best_move = (i, j)

        return best_move

    def minimax(self, depth: int, is_maximizing: bool) -> int:
        """Minimax algorithm for computer AI."""
        result = self.check_winner()
        if result == 'O':
            return 1
        if result == 'X':
            return -1
        if result == 'Draw':
            return 0

        if is_maximizing:
            best_score = float('-inf')
            for i in range(3):
                for j in range(3):
                    if self.board[i][j] == ' ':
                        self.board[i][j] = 'O'
                        score = self.minimax(depth + 1, False)
                        self.board[i][j] = ' '
                        best_score = max(score, best_score)
            return best_score
        else:
            best_score = float('inf')
            for i in range(3):
                for j in range(3):
                    if self.board[i][j] == ' ':
                        self.board[i][j] = 'X'
                        score = self.minimax(depth + 1, True)
                        self.board[i][j] = ' '
                        best_score = min(score, best_score)
            return best_score

    def get_computer_move(self) -> Tuple[int, int]:
        """Get computer move with 85% optimal and 15% random selection."""
        if random.random() < 0.85:  # 85% chance of optimal move
            return self.get_optimal_move()
        else:  # 15% chance of random move
            empty_cells = [(i, j) for i in range(3) for j in range(3) 
                          if self.board[i][j] == ' ']
            return random.choice(empty_cells)

    def parse_move(self, move: str) -> Tuple[Optional[int], Optional[int]]:
        """Parse user input move."""
        try:
            move = move.strip().upper()
            if len(move) != 2:
                return None, None
            
            row = {'A': 0, 'B': 1, 'C': 2}.get(move[0])
            col = {'1': 0, '2': 1, '3': 2}.get(move[1])
            
            return row, col
        except:
            return None, None

    def display_scores(self):
        """Display current scores."""
        print("\nScores:")
        print(f"Human (X): {self.scores['X']}")
        print(f"Computer (O): {self.scores['O']}")
        print(f"Draws: {self.scores['Draw']}\n")

    def play_game(self):
        """Main game loop."""
        print("\nWelcome to Tic-Tac-Toe!")
        print("Enter moves in format 'A1', 'B2', etc. (or 'quit' to exit)")
        
        # Random first move
        human_first = random.choice([True, False])
        current_player = 'X' if human_first else 'O'
        
        print(f"{'You go' if human_first else 'Computer goes'} first!")

        while True:
            self.display_board()
            
            if current_player == 'X':  # Human's turn
                move = input("Your move (e.g., 'A1'): ").lower()
                if move == 'quit':
                    print("\nThanks for playing!")
                    break
                    
                row, col = self.parse_move(move)
                if row is None or not self.is_valid_move(row, col):
                    print("Invalid move! Use format 'A1', 'B2', etc.")
                    continue
                    
            else:  # Computer's turn
                print("Computer is thinking...")
                time.sleep(0.5)  # Add small delay for better UX
                row, col = self.get_computer_move()
                
            self.make_move(row, col, current_player)
            
            winner = self.check_winner()
            if winner:
                self.display_board()
                if winner == 'Draw':
                    print("It's a draw!")
                    self.scores['Draw'] += 1
                else:
                    print(f"{'You win!' if winner == 'X' else 'Computer wins!'}")
                    self.scores[winner] += 1
                
                self.display_scores()
                
                play_again = input("\nPlay again? (yes/no): ").lower()
                if play_again != 'yes':
                    print("\nThanks for playing!")
                    break
                    
                # Reset for new game
                self.board = [[' ' for _ in range(3)] for _ in range(3)]
                human_first = random.choice([True, False])
                current_player = 'X' if human_first else 'O'
                print(f"\n{'You go' if human_first else 'Computer goes'} first!")
                continue
            
            current_player = 'O' if current_player == 'X' else 'X'

if __name__ == '__main__':
    game = TicTacToe()
    game.play_game()
