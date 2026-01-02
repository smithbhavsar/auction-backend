from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit
import random
from flask_cors import CORS;

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

socketio = SocketIO(app)

players = [
  { name: "Akshat Shah", house: "C/401", age: 16, mobile: "9106729889", baseValue: 0 },
  { name: "Hetal Thakkar", house: "A/101", age: 49, mobile: "9825264485", baseValue: 0 },
  { name: "Rohan Shah", house: "F/402", age: 18, mobile: "6355447315", baseValue: 0 },
  { name: "Smith Bhavsar", house: "A/502", age: 27, mobile: "9662727571", baseValue: 0 },
  { name: "Dr Samir Savaliya", house: "E/103", age: 39, mobile: "9879887775", baseValue: 0 },
  { name: "Kandarp Patel", house: "A/504", age: 40, mobile: "9824030131", baseValue: 0 },
  { name: "Heet Shah", house: "D/501", age: 18, mobile: "7041993457", baseValue: 0 },
  { name: "Deval Ajmera", house: "F/401", age: 37, mobile: "9924926767", baseValue: 0 },
  { name: "Deep Shah", house: "F/504", age: 32, mobile: "9408292970", baseValue: 0 },
  { name: "Chirayu Oza", house: "B/202", age: 42, mobile: "9824480084", baseValue: 0 },
  { name: "CJ", house: "A/203", age: 40, mobile: "9824386738", baseValue: 0 },
  { name: "Jignesh Shah", house: "D/501", age: 53, mobile: "7041993457", baseValue: 0 },
  { name: "Hemal Shah", house: "E/102", age: 40, mobile: "8141877711", baseValue: 0 },
  { name: "Atul Narang", house: "A/502", age: 42, mobile: "8980502109", baseValue: 0 },
  { name: "Dhruvin Shah", house: "B/404", age: 26, mobile: "12132756231", baseValue: 0 },
  { name: "Viral Shah", house: "B/403", age: 41, mobile: "9998800045", baseValue: 0 },
  { name: "Nitya Sanghvi", house: "A/204", age: 17, mobile: "9313410477", baseValue: 0 },
  { name: "Abhay Chaudhari", house: "C/202", age: 14, mobile: null, baseValue: 0 },
  { name: "Rishikesh Darji", house: "E/403", age: 16, mobile: null, baseValue: 0 },
  { name: "Jay Darji", house: "E/403", age: 53, mobile: null, baseValue: 0 },
  { name: "Deep Shah", house: "D/503", age: 33, mobile: null, baseValue: 0 },
  { name: "Aryan Shah", house: "C/504", age: 22, mobile: "16026076008", baseValue: 0 },
  { name: "Manan Bhatt", house: "F/503", age: 36, mobile: "7411286797", baseValue: 0 },
  { name: "Kushal Patel", house: "B/403", age: 36, mobile: "8238053118", baseValue: 0 },
  { name: "Karan Shah", house: "D/303", age: 35, mobile: "9033225454", baseValue: 0 },
  { name: "Sagar Shah", house: "F/504", age: 38, mobile: "9724506844", baseValue: 0 },
  { name: "Parth V Gurjar", house: "E/104", age: 44, mobile: "9879555098", baseValue: 0 },
  { name: "Aalap Shah", house: "C/303", age: 44, mobile: "9913957575", baseValue: 0 },
  { name: "Deval Shah", house: "C/304", age: 32, mobile: "9426548918", baseValue: 0 },
  { name: "Amit Shah", house: "F/402", age: 50, mobile: "9375202158", baseValue: 0 },
  { name: "Pradyot Bhai", house: "D/404", age: 55, mobile: "9825046330", baseValue: 0 },
  { name: "Harshil Shah", house: "B/302", age: 29, mobile: "9638990743", baseValue: 0 },
  { name: "Hemant Ajmera", house: "F/401", age: 40, mobile: "9879111783", baseValue: 0 },
  { name: "Rahil Parikh", house: "C/101", age: 25, mobile: "9106029107", baseValue: 0 },
  { name: "Smit Shah", house: "E/301", age: 45, mobile: "9825029894", baseValue: 0 },
];


captains = [
    { "id": 1, "name": 'Smith Bhavsar', "points": 3000, "team": [] },
    { "id": 2, "name": 'Heet Shah', "points": 3000, "team": [] },
    { "id": 3, "name": 'Deval Ajmera', "points": 3000, "team": [] },
    { "id": 4, "name": 'Aalap Shah', "points": 3000, "team": [] },
    { "id": 5, "name": 'Parth Gurjar', "points": 3000, "team": [] },
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
