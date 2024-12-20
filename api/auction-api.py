from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit
import random
from flask_cors import CORS;

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

socketio = SocketIO(app)

players = [
    { "name": "Viral Shah", "house": "B 403", "age": 40, "mobile": "9998800045", "baseValue": 50 },
    { "name": "Harsh Shah", "house": "D-301", "age": 41, "mobile": "9825024096", "baseValue": 50 },
    { "name": "Heet Shah", "house": "D/501", "age": 18, "mobile": "7041993447", "baseValue": 50 },
    { "name": "Shaishav Desai", "house": "C/201", "age": 45, "mobile": "9879522444", "baseValue": 50 },
    { "name": "Aalap Shah", "house": "C 303", "age": 43, "mobile": "9913957575", "baseValue": 50 },
    { "name": "Sagar Shah", "house": "F504", "age": 37, "mobile": "9724506844", "baseValue": 50 },
    { "name": "Kunal Sodagar", "house": "B/202", "age": 41, "mobile": "9825580613", "baseValue": 50 },
    { "name": "Maharsh Shah", "house": "A/202", "age": 21, "mobile": "8128265209", "baseValue": 50 },
    { "name": "Jash Shah", "house": "B 404", "age": 21, "mobile": "9484543544", "baseValue": 50 },
    { "name": "Hetal Thakkar", "house": "A/101", "age": 47, "mobile": "9825264485", "baseValue": 50 },
    { "name": "Nitya Ritesh Sanghvi", "house": "A/204", "age": 16, "mobile": "9313410477", "baseValue": 50 },
    { "name": "Pranil Nagar", "house": "F/102", "age": 15, "mobile": "9726090312", "baseValue": 50 },
    { "name": "Hemal Shah", "house": "E-102", "age": 39, "mobile": "8141877711", "baseValue": 50 },
    { "name": "Divyarajsinh Barad", "house": "A/203", "age": 33, "mobile": "9825608918", "baseValue": 50 },
    { "name": "Ketul Shah", "house": "D/302", "age": 27, "mobile": "8866046671", "baseValue": 50 },
    { "name": "Parth Gurjar", "house": "E/104", "age": 40, "mobile": "9879555098", "baseValue": 50 },
    { "name": "Deval Ajmera", "house": "F/404", "age": 40, "mobile": "9924926767", "baseValue": 50 },
    { "name": "Smith Bhavsar", "house": "A/502", "age": 26, "mobile": "9662727571", "baseValue": 50 },
    { "name": "Harshil Shah", "house": "B-302", "age": 28, "mobile": "9638990743", "baseValue": 50 },
    { "name": "Rushil Shah", "house": "D/302", "age": 29, "mobile": "9724687192", "baseValue": 50 },
    { "name": "Kandarp Patel", "house": "A/504", "age": 38, "mobile": "9824030131", "baseValue": 50 },
    { "name": "Karan Shah", "house": "D/401", "age": 37, "mobile": "9033225454", "baseValue": 50 },
    { "name": "Rohan Shah", "house": "F 402", "age": 17, "mobile": "6355447315", "baseValue": 50 },
    { "name": "Jainish Parikh", "house": "C/102", "age": 25, "mobile": "8980097675", "baseValue": 50 },
    { "name": "Chaitanya Joshi", "house": "C/404", "age": 40, "mobile": "9824386738", "baseValue": 50 },
    { "name": "Kushal Shah", "house": "B/401", "age": 38, "mobile": "+91 820-0295097", "baseValue": 50 },
    { "name": "Manan Bhatt", "house": "F/503", "age": 35, "mobile": "7411286797", "baseValue": 50 },
    { "name": "Pranav Parikh", "house": "C/303", "age": 50, "mobile": "+91 70418 04866", "baseValue": 50 },
    { "name": "Meet Thakkar", "house": "D/104", "age": 26, "mobile": "9104823002", "baseValue": 50 },
    { "name": "Amit Shah", "house": "F402", "age": 49, "mobile": "9375202158", "baseValue": 50 },
    { "name": "Rahil Parikh", "house": "C - 101", "age": 24, "mobile": "9106029107", "baseValue": 50 },
    { "name": "Jignesh Shah", "house": "D/501", "age": 50, "mobile": "+91 70419 93457", "baseValue": 50 },
    { "name": "Hemant Ajmera", "house": "F/404", "age": 40, "mobile": "+91 98791 11783", "baseValue": 50 },
    { "name": "Pradyot Chokshi", "house": "D/403", "age": 55, "mobile": "+91 98250 46330", "baseValue": 50 },
    { "name": "Mithul Nayak", "house": "B/301", "age": 38, "mobile": "9825544100", "baseValue": 50 }
]

captains = [
    { "id": 1, "name": 'Smith Bhavsar', "points": 1500, "team": [] },
    { "id": 2, "name": 'Heet Shah', "points": 1500, "team": [] },
    { "id": 3, "name": 'Deval Ajmera', "points": 1500, "team": [] },
    { "id": 4, "name": 'Aalap Shah', "points": 1500, "team": [] },
    { "id": 5, "name": 'Parth Gurjar', "points": 1500, "team": [] },
]

randomized_players = random.sample(players, len(players))
current_player_index = 0
current_player = randomized_players[current_player_index]
passed_players = []

@app.route('/all-players', methods=['GET'])
def get_all_players():
    return jsonify(players)

@app.route('/players', methods=['GET'])
def get_players():
    return jsonify(randomized_players)

@app.route('/auction-start', methods=['GET'])
def auction_start():
    return jsonify({"randomizedPlayers": randomized_players, "captains": captains, "currentPlayer": current_player})

@app.route('/place-bid', methods=['POST'])
def place_bid():
    data = request.json
    bid = data['bid']
    captain_id = data['captainId']
    captain = next(c for c in captains if c['id'] == captain_id)
    
    if len(captain['team']) >= 6:
        return jsonify({"message": "You can only buy 6 players"}), 400

    if bid > captain['points']:
        return jsonify({"message": "Not enough points to place this bid!"}), 400

    captain['points'] -= bid
    current_player['sold'] = True
    captain['team'].append({"player": current_player, "bid": bid})
    move_to_next_player()

    # Emit updated data to all clients via SocketIO
    socketio.emit('bidUpdate', {'captains': captains, 'currentPlayer': current_player, 'allPlayers': players})
    
    return jsonify({"captains": captains, "currentPlayer": current_player, "allPlayers": players})

@app.route('/pass-player', methods=['POST'])
def pass_player():
    passed_players.append(current_player)
    move_to_next_player()

    # Emit updated data after passing player
    socketio.emit('passUpdate', {'currentPlayer': current_player})

    return jsonify({"currentPlayer": current_player})

def move_to_next_player():
    global current_player, current_player_index, randomized_players
    current_player_index += 1
    
    if current_player_index < len(randomized_players):
        current_player = randomized_players[current_player_index]
    elif passed_players:
        randomized_players = passed_players[:]
        passed_players.clear()
        current_player_index = 0
        current_player = randomized_players[current_player_index]
    else:
        current_player = None

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)  # Flask-SocketIO run