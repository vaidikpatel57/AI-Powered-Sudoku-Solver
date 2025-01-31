from flask import Flask, render_template, request, jsonify
from solver import solve_sudoku

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('solver.html')

@app.route('/solve', methods=['POST'])
@app.route('/solve', methods=['POST'])
def solve():
    sudoku = request.get_json().get('sudoku')
    
    if solve_sudoku(sudoku):
        return jsonify({'solution': sudoku})
    else:
        return jsonify({'solution': None})

if __name__ == '__main__':
    app.run(debug=True)
