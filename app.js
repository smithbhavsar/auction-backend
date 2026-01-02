const cors = require('cors');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
    'http://localhost:3000', // Local development
    'https://indraprasth-cricket-auction.netlify.app', // Netlify deployment
    'https://auction-backend-d0xr.onrender.com' // Your Render backend URL
];

// CORS setup for socket.io
const io = socketIo(server, {
    cors: {
        origin: allowedOrigins, // Allow multiple origins
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true,
    },
});

// CORS setup for Express
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // Allow requests from allowed origins
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(express.json());

let players = [
  { name: "Akshat Shah", house: "C/401", age: 16, mobile: "9106729889", baseValue: 0 },
  { name: "Hetal Thakkar", house: "A/101", age: 49, mobile: "9825264485", baseValue: 0 },
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
  { name: "Abhay Chaudhari", house: "C/202", age: 14, mobile: "9727375534", baseValue: 0 },
  { name: "Rishikesh Darji", house: "E/403", age: 16, mobile: "9974045002", baseValue: 0 },
  { name: "Jay Darji", house: "E/403", age: 53, mobile: "9974045002", baseValue: 0 },
  { name: "Deep Shah", house: "D/503", age: 33, mobile: null, baseValue: 0 },
  { name: "Aryan Shah", house: "C/504", age: 22, mobile: "16026076008", baseValue: 0 },
  { name: "Manan Bhatt", house: "F/503", age: 36, mobile: "7411286797", baseValue: 0 },
  { name: "Kushal Patel", house: "B/403", age: 36, mobile: "8238053118", baseValue: 0 },
  { name: "Karan Shah", house: "D/303", age: 35, mobile: "9033225454", baseValue: 0 },
  { name: "Sagar Shah", house: "F/504", age: 38, mobile: "9724506844", baseValue: 0 },
  { name: "Aalap Shah", house: "C/303", age: 44, mobile: "9913957575", baseValue: 0 },
  { name: "Deval Shah", house: "C/304", age: 32, mobile: "9426548918", baseValue: 0 },
  { name: "Amit Shah", house: "F/402", age: 50, mobile: "9375202158", baseValue: 0 },
  { name: "Pradyot Chokshi", house: "D/404", age: 56, mobile: "9825046330", baseValue: 0 },
  { name: "Harshil Shah", house: "B/302", age: 29, mobile: "9638990743", baseValue: 0 },
  { name: "Hemant Ajmera", house: "F/401", age: 40, mobile: "9879111783", baseValue: 0 },
  { name: "Rahil Parikh", house: "C/101", age: 25, mobile: "9106029107", baseValue: 0 },
  { name: "Smit Shah", house: "E/301", age: 45, mobile: "9825029894", baseValue: 0 },
];


// Create a copy for the all players list, and add sold property
let allPlayers = players.map(player => ({ ...player, sold: false }));

// Initialize captains
let captains = [
    { id: 1, name: 'Smith Bhavsar', points: 3000, team: [] },
    { id: 2, name: 'Heet Shah', points: 3000, team: [] },
    { id: 3, name: 'Deval Ajmera', points: 3000, team: [] },
    { id: 4, name: 'Rohan Shah', points: 3000, team: [] },
    { id: 5, name: 'Parth Gurjar', points: 3000, team: [] },
];

allPlayers = allPlayers.filter(player => !captains.some(captain => captain.name === player.name));
players = players.filter(player => !captains.some(captain => captain.name === player.name));

let randomizedPlayers = players.sort(() => Math.random() - 0.5);

let currentPlayerIndex = 0;
let currentPlayer = randomizedPlayers[currentPlayerIndex];
let passedPlayers = [];

allPlayers = allPlayers.filter(player => !captains.some(captain => captain.name === player.name));

// Remove captains from the players list
players = players.filter(player => !captains.some(captain => captain.name === player.name));

// API to add a player
app.post('/players', (req, res) => {
    const { name, house, age, mobile } = req.body;
    const newPlayer = { name, house, age, mobile, sold: false }; // Add sold property
    players.push(newPlayer);
    allPlayers.push({ ...newPlayer }); // Update allPlayers as well
    res.status(201).json(newPlayer);
});

// Get all players (for the players list page)
app.get('/all-players', (req, res) => {
    res.json(allPlayers);
});

// Get random players for auction
app.get('/players', (req, res) => {
    res.json(randomizedPlayers);
});

// function resetAuction() {
//     randomizedPlayers = players.sort(() => Math.random() - 0.5); // Randomize players again
//     currentPlayerIndex = 0;
//     currentPlayer = randomizedPlayers[currentPlayerIndex];
//     passedPlayers = [];
//     captains.forEach(captain => {
//         captain.team = [];
//         captain.points = 1500; // Reset captain points
//     });

//     // Reset all players to available (sold: false)
//     allPlayers.forEach(player => {
//         player.sold = false; // Mark all players as available
//     });

//     io.emit('auctionStart', { randomizedPlayers, captains, currentPlayer });
//     io.emit('bidUpdate', { allPlayers }); // Emit updated allPlayers to clients
// }


io.on('connection', (socket) => {
    console.log('A user connected');

    socket.emit('auctionStart', { randomizedPlayers, captains, currentPlayer });

    socket.on('getAuctionData', () => {
        // Send the auction data to the client when requested
        socket.emit('auctionStart', {
            randomizedPlayers, 
            captains, 
            currentPlayer
        });
    });

    // socket.on('resetAuction', () => {
    //     resetAuction(); // Reset the auction and emit the start data again
    // });

    socket.on('placeBid', (bid, captainId) => {
        const captain = captains.find(c => c.id === captainId);

        if (captain.team.length >= 6) {
            socket.emit('errorMessage', 'You can only buy 6 players');
            return;
          }

        if (bid > captain.points) {
            socket.emit('errorMessage', 'Not enough points to place this bid!');
        } else {
            captain.points -= bid;

            currentPlayer.sold = true;
            const allPlayersIndex = allPlayers.findIndex(p => p.name === currentPlayer.name);
            if (allPlayersIndex !== -1) {
                allPlayers[allPlayersIndex].sold = true;
            }

            captain.team.push({ player: currentPlayer, bid });
            io.emit('bidUpdate', { captains, currentPlayer, allPlayers });

            moveToNextPlayer();
        }
    });  

    socket.on('passPlayer', () => {
        console.log('Player passed:', currentPlayer.name);
        passedPlayers.push(currentPlayer);

        moveToNextPlayer();
    });

    function moveToNextPlayer() {
        currentPlayerIndex++;
    
        if (currentPlayerIndex < randomizedPlayers.length) {
            currentPlayer = randomizedPlayers[currentPlayerIndex];
            io.emit('nextPlayer', currentPlayer);
        } else if (passedPlayers.length > 0) {
            console.log('All players shown once. Revisiting passed players...');
            randomizedPlayers = [...passedPlayers]; // Reassign with passed players
            passedPlayers = []; // Reset passed players
            currentPlayerIndex = 0; // Restart index
            currentPlayer = randomizedPlayers[currentPlayerIndex]; // Set next player
            io.emit('nextPlayer', currentPlayer);
        } else {
            currentPlayer = null;
            console.log('Auction Ended');
            io.emit('auctionEnd'); 
        }
    }

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, '0.0.0.0', () => {
    console.log("Server running on port",PORT);
});
