const cors = require('cors');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
    'http://localhost:3000',
    'https://rspl-cricket-auction.netlify.app',
    'https://auction-backend-d0xr.onrender.com'
];

// CORS setup for socket.io
const io = socketIo(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.error('Socket.IO CORS blocked origin:', origin);
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(express.json());

let players = [
  { name: "Amit Gajjar", house: "A/1304", mobile: "9960287599", skills: "Batting", baseValue: 10000 },
  { name: "Chandan Agrawal", house: "B/401", mobile: "7008564514", skills: "All Rounder", baseValue: 10000 },
  { name: "Vishal", house: "D/2001", mobile: "9601010009", skills: "All Rounder", baseValue: 10000 },
  { name: "Mukesh Agrawal", house: "B/303", mobile: "7874441000", skills: "All Rounder", baseValue: 10000 },
  { name: "Pranav Trivedi", house: "D/902", mobile: "9825804223", skills: "All Rounder", baseValue: 10000 },
  { name: "Suraj Aggarwal", house: "D/1502", mobile: "9429899905", skills: "All Rounder", baseValue: 10000 },
  { name: "Dilip Ratwani", house: "B/804", mobile: "9825877480", skills: "Batting", baseValue: 10000 },
  { name: "Hardev Dodia", house: "D/303", mobile: "9727424512", skills: "All Rounder", baseValue: 10000 },
  { name: "Anil Sharma", house: "D/1102", mobile: "8141652810", skills: "All Rounder", baseValue: 10000 },
  { name: "Sachin Batavia", house: "B/1204", mobile: "7874931515", skills: "Batting", baseValue: 10000 },
  { name: "Parv Gupta", house: "C/1303", mobile: "9711440500", skills: "All Rounder", baseValue: 10000 },
  { name: "Bharat Goswami", house: "A/903", mobile: "9429206609", skills: "Batting", baseValue: 10000 },
  { name: "Chirag Akbari", house: "A/1603", mobile: "9033366848", skills: "All Rounder", baseValue: 10000 },
  { name: "Saurabh Toshniwal", house: "B/901", mobile: "9674737336", skills: "All Rounder", baseValue: 10000 },
  { name: "Piyush Matai", house: "B/1903", mobile: "9909941144", skills: "Batting", baseValue: 10000 },
  { name: "Rasik Godhani", house: "C/1202", mobile: "9375936431", skills: "All Rounder", baseValue: 10000 },
  { name: "Kaushal Kansara", house: "A/1104", mobile: "9979419945", skills: "Batting", baseValue: 10000 },
  { name: "Jinash Shah", house: "A/904", mobile: "9879614377", skills: "All Rounder", baseValue: 10000 },
  { name: "Yogesh Thakkar", house: "B/102", mobile: "8980035014", skills: "All Rounder", baseValue: 10000 },
  { name: "Akash Doultani", house: "B/1603", mobile: "9925265352", skills: "All Rounder", baseValue: 10000 },
  { name: "Dharmendrasinh Barad", house: "B/1802", mobile: "9712141616", skills: "All Rounder", baseValue: 10000 },
  { name: "Pankaj Agrawal", house: "B/1902", mobile: "9712969635", skills: "All Rounder", baseValue: 10000 },
  { name: "Dinesh Bansal", house: "A/901", mobile: "9971948202", skills: "All Rounder", baseValue: 10000 },
  { name: "Vipul Gajjar", house: "C/1803", mobile: "9328815309", skills: "All Rounder", baseValue: 10000 },
  { name: "Gautam Modi", house: "B/902", mobile: "9909987705", skills: "All Rounder", baseValue: 10000 },
  { name: "Tushar Ghelani", house: "D/1004", mobile: "9586299905", skills: "Bowling", baseValue: 10000 },
  { name: "Ankur Joshi", house: "C/1702", mobile: "8460296800", skills: "All Rounder", baseValue: 10000 },
  { name: "Manish Gaba", house: "A/1403", mobile: "9826355545", skills: "Bowling", baseValue: 10000 },
  { name: "Vansh T. Ghelani", house: "D/1004", mobile: "9586199905", skills: "Bowling", baseValue: 10000 },
  { name: "Atul Narang", house: "C/1904", mobile: "8980502109", skills: "All Rounder", baseValue: 10000 },
  { name: "Stavan Pandya", house: "D/701", mobile: "9898704606", skills: "All Rounder", baseValue: 10000 },
  { name: "Rahul Agrawal", house: "D/1704", mobile: "7009550413", skills: "Batting", baseValue: 10000 },
  { name: "Ashok Sharma", house: "D/801", mobile: "6351081530", skills: "All Rounder", baseValue: 10000 },
  { name: "Pratik Pujara", house: "C/1003", mobile: "9825938221", skills: "All Rounder", baseValue: 10000 },
  { name: "Bharat Sajnani", house: "A/101", mobile: "8160252745", skills: "All Rounder", baseValue: 10000 },
  { name: "Yash Sajnani", house: "A/101", mobile: "9727604943", skills: "Batting", baseValue: 10000 },
  { name: "Pratik Haria", house: "A/1803", mobile: "9825046163", skills: "Bowling", baseValue: 10000 },
  { name: "Mohit Jaiswal", house: "C/203", mobile: "8802678330", skills: "All Rounder", baseValue: 10000 },
  { name: "Apresh Tripathi", house: "D/1501", mobile: "7573032227", skills: "All Rounder", baseValue: 10000 },
  { name: "Hemanshu Daxini", house: "D/1904", mobile: "9979887899", skills: "Batting", baseValue: 10000 },
  { name: "Chetan Patel", house: "D/1902", mobile: "9824832541", skills: "All Rounder", baseValue: 10000 },
  { name: "Rakesh Ramani", house: "D/1802", mobile: "9974013009", skills: "All Rounder", baseValue: 10000 },
  { name: "Neel Trivedi", house: "D/1002", mobile: "9429881066", skills: "Bowling", baseValue: 10000 },
  { name: "Abhinav Mammya", house: "B/1704", mobile: "9016901966", skills: "All Rounder", baseValue: 10000 },
  { name: "Ishan Shah", house: "A/801", mobile: "9099035500", skills: "Batting", baseValue: 10000 },
  { name: "Vishal Patel", house: "D/2004", mobile: "9825976011", skills: "Bowling", baseValue: 10000 },
  { name: "Pranjal Pandya", house: "D/102", mobile: "9662008011", skills: "All Rounder", baseValue: 10000 },
  { name: "Trushant Joshipura", house: "A/401", mobile: "9825007051", skills: "All Rounder", baseValue: 10000 },
  { name: "Rahul Singhvi", house: "C/1502", mobile: "9825117375", skills: "Batting", baseValue: 10000 },
  { name: "Samvit Todi", house: "B/1301", mobile: "9925045577", skills: "All Rounder", baseValue: 10000 },
  { name: "Rajesh Rao", house: "B/403", mobile: "9825017050", skills: "All Rounder", baseValue: 10000 },
  { name: "Sahaj Goel", house: "D/603", mobile: "9825000873", skills: "All Rounder", baseValue: 10000 },
  { name: "Viral Gajjar", house: "C/901", mobile: "6351081530", skills: "All Rounder", baseValue: 10000 },
  { name: "Darsh Gajjar", house: "C/901", mobile: "6351081530", skills: "All Rounder", baseValue: 10000 },
  { name: "Hemant Arora", house: "C/501", mobile: "9429003982", skills: "All Rounder", baseValue: 10000 },
  { name: "Shanil Soni", house: "A", mobile: "9998796966", skills: "All Rounder", baseValue: 10000 },
  { name: "Neev Pujara", house: "C/1003", mobile: "9825938221", skills: "All Rounder", baseValue: 10000 },
  { name: "Jinesh Shah", house: "A/501", mobile: "9821707072", skills: "All Rounder", baseValue: 10000 },
  { name: "Prakash Donga", house: null, mobile: "9429052994", skills: "All Rounder", baseValue: 10000 },
  {name: "Ravi Sonagra",house: null,mobile: null,skills: null,baseValue: 10000},
  {name: "Aarush",house: null,mobile: null,skills: null,baseValue: 10000},
  {name: "Naveen",house: null,mobile: null,skills: null,baseValue: 10000},
  {name: "Dr. Janmesh Shah",house: null,mobile: null,skills: null,baseValue: 10000},
  {name: "Raj Sharma",house: null,mobile: null,skills: null,baseValue: 10000}
];


// Create a copy for the all players list, and add sold property
let allPlayers = players.map(player => ({ ...player, sold: false }));

// Initialize captains
let captains = [
    { id: 1, name: 'Dilip Ratwani', points: 1000000, team: [] },
    { id: 2, name: 'Rahul Singhvi', points: 1000000, team: [] },
    { id: 3, name: 'Tushar Ghelani', points: 1000000, team: [] },
    { id: 4, name: 'Parv Gupta', points: 1000000, team: [] },
    { id: 5, name: 'Dinesh Bansal', points: 1000000, team: [] },
    { id: 6, name: 'Mukesh Agrawal', points: 1000000, team: [] },
    { id: 7, name: 'Ashok Sharma', points: 1000000, team: [] },
    { id: 8, name: 'Amit Gajjar', points: 1000000, team: [] }
];

allPlayers = allPlayers.filter(player => !captains.some(captain => captain.name === player.name));
players = players.filter(player => !captains.some(captain => captain.name === player.name));

let randomizedPlayers = players.sort(() => Math.random() - 0.5);

let currentPlayerIndex = 0;
let currentPlayer = randomizedPlayers[currentPlayerIndex];
let passedPlayers = [];
const BASE_VALUE = 10000;
const MAX_TEAM_SIZE = 7;

allPlayers = allPlayers.filter(player => !captains.some(captain => captain.name === player.name));

// Remove captains from the players list
players = players.filter(player => !captains.some(captain => captain.name === player.name));

// API to add a player
app.post('/players', (req, res) => {
    const { name, house, skills, mobile } = req.body;
    const newPlayer = { name, house, skills, mobile, sold: false }; // Add sold property
    players.push(newPlayer);
    allPlayers.push({ ...newPlayer }); // Update allPlayers as well
    res.status(201).json(newPlayer);
});

function remainingSlots(captain) {
    return MAX_TEAM_SIZE - captain.team.length;
}

function getMaxAllowedBid(captain) {
    const slotsLeft = remainingSlots(captain);
    return captain.points - (slotsLeft - 1) * BASE_VALUE;
}
function noPlayersLeft() {
    return (
        !currentPlayer ||
        randomizedPlayers.every(player => player.sold)
    );
}

function emitPassAvailability() {
    io.emit('passAvailability', {
        canPass: !noPlayersLeft()
    });
}

// Get all players (for the players list page)
app.get('/all-players', (req, res) => {
    res.json(allPlayers);
});

// Get random players for auction
app.get('/players', (req, res) => {
    res.json(randomizedPlayers);
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.emit('auctionStart', { randomizedPlayers, captains, currentPlayer });

    emitPassAvailability();
    
    captains.forEach(captain => {
        socket.emit('bidLimits', {
            captainId: captain.id,
            maxBid: getMaxAllowedBid(captain)
        });
    });

    socket.on('getAuctionData', () => {
        // Send the auction data to the client when requested
        socket.emit('auctionStart', {
            randomizedPlayers, 
            captains, 
            currentPlayer
        });
    });

    socket.on('placeBid', (bid, captainId) => {
    const captain = captains.find(c => c.id === captainId);

    const slotsLeft = remainingSlots(captain);

    // Team full check
    if (slotsLeft <= 0) {
        socket.emit('errorMessage', 'Your team is already full');
        return;
    }

    // Minimum bid enforcement
    if (bid < BASE_VALUE) {
        socket.emit(
            'errorMessage',
            `Minimum bid is ₹${BASE_VALUE}`
        );
        return;
    }

    const maxAllowedBid = getMaxAllowedBid(captain);

    // Core constraint logic
    if (bid > maxAllowedBid) {
        socket.emit(
            'errorMessage',
            `You can bid max ₹${maxAllowedBid}. You must reserve ₹${BASE_VALUE * (slotsLeft - 1)} for remaining players`
        );
        return;
    }

    // Final balance safety
    if (bid > captain.points) {
        socket.emit('errorMessage', 'Not enough points');
        return;
    }

    // Deduct points
    captain.points -= bid;

    // Mark sold
    currentPlayer.sold = true;
    const allPlayersIndex = allPlayers.findIndex(p => p.name === currentPlayer.name);
    if (allPlayersIndex !== -1) {
        allPlayers[allPlayersIndex].sold = true;
    }

    // Add to team
    captain.team.push({ player: currentPlayer, bid });

    io.emit('bidUpdate', { captains, currentPlayer, allPlayers });
    emitPassAvailability();
    moveToNextPlayer();
});

    socket.on('passPlayer', () => {
        if (noPlayersLeft()) {
            socket.emit('errorMessage', 'No players left to pass.');
            return;
        }
    
        console.log('Player passed:', currentPlayer.name);
        passedPlayers.push(currentPlayer);
        
        moveToNextPlayer();
    });

    function moveToNextPlayer() {
        currentPlayerIndex++;
    
        if (currentPlayerIndex < randomizedPlayers.length) {
            currentPlayer = randomizedPlayers[currentPlayerIndex];
            io.emit('nextPlayer', currentPlayer);
             emitPassAvailability();
        } else if (passedPlayers.length > 0) {
            console.log('All players shown once. Revisiting passed players...');
            randomizedPlayers = [...passedPlayers]; // Reassign with passed players
            passedPlayers = []; // Reset passed players
            currentPlayerIndex = 0; // Restart index
            currentPlayer = randomizedPlayers[currentPlayerIndex]; // Set next player
            io.emit('nextPlayer', currentPlayer);
            emitPassAvailability();
        } else {
            currentPlayer = null;
            console.log('Auction Ended');
            io.emit('auctionEnd');
            emitPassAvailability();
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
