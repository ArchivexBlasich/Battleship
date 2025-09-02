# Battleship 🎯

[Live Preview](https://archivexblasich.github.io/Battleship/)

A browser version of the classic Battleship game, built as part of [The Odin Project](https://www.theodinproject.com/).  
The goal was to practice **TDD with Jest**, **object-oriented design**, and DOM interaction.

---

## What I Practiced

- Writing tests first with **Jest** (ships, boards, players).
- Splitting the game into small modules (`Ship`, `Gameboard`, `Player`, `GameController`, `DOMController`).
- Making the computer attack intelligently (random + follow-up attacks near hits).
- Adding **drag and drop** ship placement with hover previews.

---

## How It Works

1. **Ships** keep track of hits and can be sunk.  
2. **Gameboards** place ships, handle attacks, and track misses.  
3. **Players** (human and computer) each get a board.  
4. **GameController** runs the turns and checks for a winner.  
5. **DOMController** updates the board in the browser and listens for clicks/drag events.

---

## Computer attacks

- **Hunter mode**: random attacks on unvisited cells.  
- **Target mode**: if a hit is found, attack its neighbors until the ship is sunk.  

---

## Features

- Play against the computer.  
- Random + smarter computer attacks.  
- Drag-and-drop ship placement (horizontal/vertical).  
- Hit/miss feedback directly on the board.  
- Game ends automatically when all ships are sunk.  

---

## Testing

- Core logic tested with **Jest**.  
- DOM tested manually by playing.  

---

## Technologies

- JavaScript (ESM)  
- Jest  
- HTML + CSS  

---

[Play here](https://archivexblasich.github.io/Battleship/)
