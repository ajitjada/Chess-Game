const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard")
const turnIndicator = document.getElementById("turnIndicator");
const gameOverModel = document.getElementById("gameOverModal")
const gameOverText = document.getElementById("gameOverText")

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

let selectedSquare = null;
let possibleMoves = []

let gameOver = false;

const renderBoard = () => {
    const board = chess.board()
    boardElement.innerHTML = ""
    board.forEach((row, rowindex) => {
        row.forEach((square, squareindex) => {
            const squareElement = document.createElement("div")
            squareElement.classList.add(
                "square",
                (rowindex + squareindex) % 2 === 0 ? "light" : "dark"
            )

            squareElement.dataset.row = rowindex
            squareElement.dataset.col = squareindex

            const currentSquare =
                String.fromCharCode(97 + squareindex) +
                (8 - rowindex);

            if (possibleMoves.some(move => move.to === currentSquare)) {
                squareElement.classList.add("possible-move");
            }

            if (
                selectedSquare &&
                selectedSquare.row === rowindex &&
                selectedSquare.col === squareindex
            ) {
                squareElement.classList.add("selected");
            }

            if (square) {
                const pieceElement = document.createElement("div")
                pieceElement.classList.add(
                    "piece",
                    square.color === "w" ? "white" : "black"
                )
                pieceElement.innerText = getPieceUnicode(square)
                pieceElement.draggable = playerRole === square.color;

                pieceElement.addEventListener("click", (e) => {
                    e.stopPropagation();

                    if (playerRole !== square.color) return;

                    selectedSquare = {
                        row: rowindex,
                        col: squareindex
                    };

                    const squareName =
                        String.fromCharCode(97 + selectedSquare.col) +
                        (8 - selectedSquare.row);

                    possibleMoves = chess.moves({
                        square: squareName,
                        verbose: true
                    });

                    renderBoard();
                });

                pieceElement.addEventListener("dragstart", (e) => {
                    if (pieceElement.draggable) {

                        draggedPiece = pieceElement

                        squareElement.classList.add("selected")

                        sourceSquare = { row: rowindex, col: squareindex }

                        const squareName = String.fromCharCode(97 + squareindex) + (8 - rowindex);

                        squareElement.dataset.square = squareName;

                        possibleMoves = chess.moves({
                            square: squareName,
                            verbose: true
                        });

                        setTimeout(() => {
                            renderBoard();
                        }, 0);

                        e.dataTransfer.setData("text/plain", "")
                    }
                })

                pieceElement.addEventListener("dragend", (e) => {
                    possibleMoves = []

                    renderBoard()

                    draggedPiece = null
                    sourceSquare = null
                })

                squareElement.appendChild(pieceElement)
            }

            squareElement.addEventListener("dragover", function (e) {
                e.preventDefault()
            })

            squareElement.addEventListener("click", () => {

                if (!selectedSquare) return;

                const target = {
                    row: rowindex,
                    col: squareindex
                };

                handleMove(selectedSquare, target);

                selectedSquare = null;
            });

            squareElement.addEventListener("drop", function (e) {
                e.preventDefault()
                if (draggedPiece) {
                    const targetSource = {
                        row: parseInt(squareElement.dataset.row),
                        col: parseInt(squareElement.dataset.col),
                    }

                    handleMove(sourceSquare, targetSource)
                }
            })



            boardElement.appendChild(squareElement)
        })
    })

    if (playerRole === "b") {
        boardElement.classList.add("flipped")
    } else {
        boardElement.classList.remove("flipped")
    }

    const currentTurn = chess.turn();

    if (playerRole === null) {
        turnIndicator.innerText =
            currentTurn === "w"
                ? "White's Turn"
                : "Black's Turn";
    }
    else if (playerRole === currentTurn) {
        turnIndicator.innerHTML = `🟢 Your Turn `;
    }
    else {
        turnIndicator.innerHTML = "⏳ Opponent's Turn";
    }
}

const handleMove = (source, target) => {

    if (gameOver) return;

    selectedSquare = null;
    possibleMoves = []

    const move = {
        from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
        to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
        promotion: "q",
    }

    socket.emit("move", move)
}

const getPieceUnicode = (piece) => {
    const unicodePieces = {
        wp: "♙",
        wr: "♖",
        wn: "♘",
        wb: "♗",
        wq: "♕",
        wk: "♔",

        bp: "♟",
        br: "♜",
        bn: "♞",
        bb: "♝",
        bq: "♛",
        bk: "♚",
    };

    return unicodePieces[piece.color + piece.type] || "";
}

socket.on("playerRole", function (role) {
    playerRole = role
    renderBoard()
})

socket.on("spectatorRole", function () {
    playerRole = null
    renderBoard()
})

socket.on("boardState", function (fen) {
    chess.load(fen)
    renderBoard()
})

socket.on("gameOver", (data) => {
    gameOver = true;
    gameOverModel.classList.remove("hidden")

    if (!data.winner) {
        gameOverText.innerText = `Draw!\n${data.reason}`;
        return;
    }

    if (data.winner === playerRole) {
        gameOverText.innerHTML = `
            🎉You Won!<br>
            Congratulations!<br>
            <span style="font-size:14px">${data.reason}</span>`
    } else {
        gameOverText.innerHTML = `
            😔 You Lost!<br>
            Better Luck Next Time<br>
            <span style="font-size:14px">${data.reason}</span>`
    }
});

renderBoard()