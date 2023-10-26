<template>
    <div class="chess-board" ref="chessBoard" @drop="pieceDrop" @dragover.prevent>
        <img class="piece" :class="piece.playerId === playerId ? 'cursor-grab' : 'cursor-default'" @click="selectPiece(piece)" @drag="pieceDragging" @dragstart="pieceDragStart" v-for="piece in boardPieces"
        :style="[
            { 'top': `calc(var(--cell-size) * (${piece.rowIndex} + 1) - 82px)` },
            { 'left': `calc(var(--cell-size) * ${piece.colIndex})` }
        ]" :src="getImageUrl(piece.name)" />
        <div v-for="(_, colIndex) in boardSquares" class="column">
            <div v-for="(_, rowIndex) in boardSquares" :key="`${colIndex}-${rowIndex}`" class="cell" :class="[(colIndex + rowIndex) % 2 === 0 ? 'light' : 'dark', boardSquares[colIndex]![rowIndex]!.selected ? 'selected' : '']"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { BoardPieceInterface } from '@interfaces/BoardPieceInterface';
import type { BoardSquareInterface } from '@interfaces/BoardSquareInterface';
import { computed, reactive, ref } from 'vue';

const pieceMovesCount = ref(1);
const chessBoard = ref<HTMLElement>();

const cellSize = computed(() => {
    return parseFloat(getComputedStyle(document.body).getPropertyValue('--chess-board-size-number')) / parseFloat(getComputedStyle(document.body).getPropertyValue('--row-col-number'));
});

const boardSquares = ref<BoardSquareInterface[][]>([
    [{ name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }],
    [{ name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }],
    [{ name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }],
    [{ name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }],
    [{ name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }],
    [{ name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }],
    [{ name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }],
    [{ name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }]
]);

const boardPieces = ref<BoardPieceInterface[]>([
    { colIndex: 0, name: 'b-rook', playerId: 0, rowIndex: 0 },
    { colIndex: 1, name: 'b-knight', playerId: 0, rowIndex: 0 },
    { colIndex: 2, name: 'b-bishop', playerId: 0, rowIndex: 0 },
    { colIndex: 3, name: 'b-queen', playerId: 0, rowIndex: 0 },
    { colIndex: 4, name: 'b-king', playerId: 0, rowIndex: 0 },
    { colIndex: 5, name: 'b-bishop', playerId: 0, rowIndex: 0 },
    { colIndex: 6, name: 'b-knight', playerId: 0, rowIndex: 0 },
    { colIndex: 7, name: 'b-rook', playerId: 0, rowIndex: 0 },
    { colIndex: 0, name: 'b-pawn', playerId: 0, rowIndex: 1 },
    { colIndex: 1, name: 'b-pawn', playerId: 0, rowIndex: 1 },
    { colIndex: 2, name: 'b-pawn', playerId: 0, rowIndex: 1 },
    { colIndex: 3, name: 'b-pawn', playerId: 0, rowIndex: 1 },
    { colIndex: 4, name: 'b-pawn', playerId: 0, rowIndex: 1 },
    { colIndex: 5, name: 'b-pawn', playerId: 0, rowIndex: 1 },
    { colIndex: 6, name: 'b-pawn', playerId: 0, rowIndex: 1 },
    { colIndex: 7, name: 'b-pawn', playerId: 0, rowIndex: 1 },
    { colIndex: 0, name: 'w-pawn', playerId: 1, rowIndex: 6 },
    { colIndex: 1, name: 'w-pawn', playerId: 1, rowIndex: 6 },
    { colIndex: 2, name: 'w-pawn', playerId: 1, rowIndex: 6 },
    { colIndex: 3, name: 'w-pawn', playerId: 1, rowIndex: 6 },
    { colIndex: 4, name: 'w-pawn', playerId: 1, rowIndex: 6 },
    { colIndex: 5, name: 'w-pawn', playerId: 1, rowIndex: 6 },
    { colIndex: 6, name: 'w-pawn', playerId: 1, rowIndex: 6 },
    { colIndex: 7, name: 'w-pawn', playerId: 1, rowIndex: 6 },
    { colIndex: 0, name: 'w-rook', playerId: 1, rowIndex: 7 },
    { colIndex: 1, name: 'w-knight', playerId: 1, rowIndex: 7 },
    { colIndex: 2, name: 'w-bishop', playerId: 1, rowIndex: 7 },
    { colIndex: 3, name: 'w-queen', playerId: 1, rowIndex: 7 },
    { colIndex: 4, name: 'w-king', playerId: 1, rowIndex: 7 },
    { colIndex: 5, name: 'w-bishop', playerId: 1, rowIndex: 7 },
    { colIndex: 6, name: 'w-knight', playerId: 1, rowIndex: 7 },
    { colIndex: 7, name: 'w-rook', playerId: 1, rowIndex: 7 }
]);

const pieceDragging = (e: DragEvent): void => {
    const piece = e.target as HTMLElement;

    let mouseX = e.clientX;
    let mouseY = e.clientY;

    if(mouseX !== 0 && mouseY !== 0) {
        if(mouseX < chessBoard.value!.offsetLeft - window.scrollX) mouseX = chessBoard.value!.offsetLeft - window.scrollX;
        if(mouseY < chessBoard.value!.offsetTop - window.scrollY) mouseY = chessBoard.value!.offsetTop - window.scrollY;
        if(mouseX > chessBoard.value!.clientWidth + chessBoard.value!.offsetLeft - window.scrollX) mouseX = chessBoard.value!.clientWidth + chessBoard.value!.offsetLeft - window.scrollX;
        if(mouseY > chessBoard.value!.clientHeight + chessBoard.value!.offsetTop - window.scrollY) mouseY = chessBoard.value!.clientHeight + chessBoard.value!.offsetTop - window.scrollY;
        piece.style.left = `calc(${mouseX - chessBoard.value!.offsetLeft + window.scrollX}px - (var(--cell-size) / 2))`;
        piece.style.top = `calc(${mouseY - chessBoard.value!.offsetTop + window.scrollY}px - (var(--cell-size) / 2))`;
    }
};

const pieceDragStart = (e: DragEvent): void => {
    e.dataTransfer!.effectAllowed = 'move';
    e.dataTransfer!.setDragImage(e.target as HTMLElement, -9999, -9999);
    (e.target as HTMLElement).style.zIndex = `${pieceMovesCount.value++}`;
};

const getCellFromMousePosition = (mouseX: number, mouseY: number): { colIndex: number; rowIndex: number } => {
    let colIndex = Math.floor((mouseX - chessBoard.value!.offsetLeft + window.scrollX) / cellSize.value);
    let rowIndex = Math.floor((mouseY - chessBoard.value!.offsetTop + window.scrollY) / cellSize.value);
    if(mouseX < chessBoard.value!.offsetLeft - window.scrollX) colIndex = 0;
    if(mouseY < chessBoard.value!.offsetTop - window.scrollY) rowIndex = 0;
    if(mouseX > chessBoard.value!.clientWidth + chessBoard.value!.offsetLeft - window.scrollX) colIndex = 7;
    if(mouseY > chessBoard.value!.clientHeight + chessBoard.value!.offsetTop - window.scrollY) rowIndex = 7;

    return { colIndex, rowIndex };
};

const pieceDrop = (e: DragEvent): void => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const { colIndex, rowIndex } = getCellFromMousePosition(mouseX, mouseY);
    const piece = e.target as HTMLElement;
    piece.style.left = `calc(var(--cell-size) * (${colIndex} + 1) - 82px)`;
    piece.style.top = `calc(var(--cell-size) * ${rowIndex})`;
};

const selectedPiece = reactive<BoardPieceInterface>({ colIndex: -1, name: '', rowIndex: -1 });
const playerId = 1;

const selectPiece = (piece: BoardPieceInterface): void => {
    const pieceToSelectIndex = boardPieces.value.findIndex((p) => p.colIndex === piece.colIndex && p.rowIndex === piece.rowIndex);

    // if no selected piece
    if(!selectedPiece.name) {
        const pieceToSelectIndex = boardPieces.value.findIndex((p) => p.colIndex === piece.colIndex && p.rowIndex === piece.rowIndex);
        const pieceToSelect = boardPieces.value[pieceToSelectIndex];

        if(pieceToSelect!.playerId === playerId) {
            boardPieces.value[pieceToSelectIndex]!.selected = true;
            boardSquares.value[piece.colIndex]![piece.rowIndex]!.selected = true;

            Object.assign(selectedPiece, piece);
        }
    } else {
        boardPieces.value[boardPieces.value.findIndex((p) => p.colIndex === selectedPiece.colIndex && p.rowIndex === selectedPiece.rowIndex)]!.selected = false;
        boardSquares.value[selectedPiece.colIndex]![selectedPiece.rowIndex]!.selected = false;

        // if not the same as current piece
        if(selectedPiece.colIndex !== piece.colIndex || selectedPiece.rowIndex !== piece.rowIndex) {
            // TODO : Affecter les pieces selectionnées à des players (si pas déjà fait) et selectionner true la piece demandée

            // if piece belongs to the player
            const pieceToSelect = boardPieces.value[pieceToSelectIndex];
            if(pieceToSelect!.playerId === playerId) {
                pieceToSelect!.selected = true;
                boardSquares.value[piece.colIndex]![piece.rowIndex]!.selected = true;
                selectedPiece.name = pieceToSelect!.name;
                selectedPiece.colIndex = piece.colIndex;
                selectedPiece.rowIndex = piece.rowIndex;
            } else {
                selectedPiece.name = '';
            }
            /*
             else {
                if(isValidMove(targetColIndex, targetRowIndex)) {
                    boardPieces.value[targetColIndex]![targetRowIndex]!.name = selectedPiece.name;
                    boardPieces.value[targetColIndex]![targetRowIndex]!.playerId = playerId;
                    boardPieces.value[selectedPiece.colIndex!]![selectedPiece.rowIndex!]!.name = '';
                    boardPieces.value[selectedPiece.colIndex!]![selectedPiece.rowIndex!]!.playerId = -1;
                }
            }
            */
        } else {
            Object.assign(selectedPiece, { colIndex: -1, name: '', rowIndex: -1 });
        }
    }
};

const isPieceBetweenInColumn = (colIndex: number, firstIndex: number, secondIndex: number): boolean => {
    const pos = [firstIndex, secondIndex].sort((a, b) => a - b);
    return boardPieces.value[colIndex]?.filter((val, index) => val.name.length && index > pos[0]! && index < pos[1]!).length! > 0;
};

const isPieceBetweenInRow = (rowIndex: number, firstIndex: number, secondIndex: number): boolean => {
    const pos = [firstIndex, secondIndex].sort((a, b) => a - b);
    return boardPieces.value.filter((val, index) => val[rowIndex]?.name.length && index > pos[0]! && index < pos[1]!).length! > 0;
};

const isPieceInDiagonal = (colA: number, rowA: number, colB: number, rowB: number): boolean => {
    if(colB > colA) {
        // droite
        const y = rowA;
        for(let x = colA + 1; x < colB; x++) {
            // action bas ou haut
            const nextY = rowB > rowA ?
                y + (x - colA) :
                y - (x - colA);
            if(boardPieces.value[x]![nextY]!.name.length) return true;
        }
    } else {
        // gauche
        const y = rowA;
        for(let x = colA - 1; x > colB; x--) {
            // action bas ou haut
            const nextY = rowB > rowA ?
                y + (colA - x) :
                y - (colA - x);
            if(boardPieces.value[x]![nextY]!.name.length) return true;
        }
    }
    return false;
};

const isKingCheck = (colIndex: number, rowIndex: number): boolean => {
    /* 1 autour
    diagonales
    lignes
    */
    return false;
};

const isValidMove = (targetColIndex: number, targetRowIndex: number): boolean => {
    const pieceName: string = selectedPiece.name ? selectedPiece.name.split('-')[1]! : '';
    if(pieceName === 'rook') {
        return targetColIndex === selectedPiece.colIndex && !isPieceBetweenInColumn(targetColIndex, selectedPiece.rowIndex!, targetRowIndex) || targetRowIndex === selectedPiece.rowIndex && !isPieceBetweenInRow(targetRowIndex, selectedPiece.colIndex!, targetColIndex);
    } else if(pieceName === 'knight') {
        /*
        haut gauche
        haut droite
        bas gauche
        bas droite
        gauche haut
        gauche bas
        droite haut
        droite bas
        */
        return targetColIndex === selectedPiece.colIndex! - 1 && targetRowIndex === selectedPiece.rowIndex! - 2 || targetColIndex === selectedPiece.colIndex! + 1 && targetRowIndex === selectedPiece.rowIndex! - 2 || targetColIndex === selectedPiece.colIndex! - 1 && targetRowIndex === selectedPiece.rowIndex! + 2 || targetColIndex === selectedPiece.colIndex! + 1 && targetRowIndex === selectedPiece.rowIndex! + 2 ||
        targetColIndex === selectedPiece.colIndex! - 2 && targetRowIndex === selectedPiece.rowIndex! - 1 ||
        targetColIndex === selectedPiece.colIndex! - 2 && targetRowIndex === selectedPiece.rowIndex! + 1 ||
        targetColIndex === selectedPiece.colIndex! + 2 && targetRowIndex === selectedPiece.rowIndex! - 1 ||
        targetColIndex === selectedPiece.colIndex! + 2 && targetRowIndex === selectedPiece.rowIndex! + 1;
    } else if(pieceName === 'bishop') {
        return Math.abs(targetColIndex - selectedPiece.colIndex!) === Math.abs(targetRowIndex - selectedPiece.rowIndex!) && !isPieceInDiagonal(selectedPiece.colIndex!, selectedPiece.rowIndex!, targetColIndex, targetRowIndex);
    } else if(pieceName === 'queen') {
        return targetColIndex === selectedPiece.colIndex && !isPieceBetweenInColumn(targetColIndex, selectedPiece.rowIndex!, targetRowIndex) || targetRowIndex === selectedPiece.rowIndex && !isPieceBetweenInRow(targetRowIndex, selectedPiece.colIndex!, targetColIndex) || !isPieceInDiagonal(selectedPiece.colIndex!, selectedPiece.rowIndex!, targetColIndex, targetRowIndex);
    } else if(pieceName === 'king') {
        /*
        droite
        gauche
        bas
        haut
        haut droite
        haut gauche
        bas droite
        bas gauche
        */
        return (targetColIndex === selectedPiece.colIndex! + 1 && targetRowIndex === selectedPiece.rowIndex || targetColIndex === selectedPiece.colIndex! - 1 && targetRowIndex === selectedPiece.rowIndex || targetRowIndex === selectedPiece.rowIndex! + 1 && targetColIndex === selectedPiece.colIndex || targetRowIndex === selectedPiece.rowIndex! - 1 && targetColIndex === selectedPiece.colIndex || targetColIndex === selectedPiece.colIndex! + 1 && targetRowIndex === selectedPiece.rowIndex! - 1 || targetColIndex === selectedPiece.colIndex! - 1 && targetRowIndex === selectedPiece.rowIndex! - 1 || targetColIndex === selectedPiece.colIndex! + 1 && targetRowIndex === selectedPiece.rowIndex! + 1 || targetColIndex === selectedPiece.colIndex! - 1 && targetRowIndex === selectedPiece.rowIndex! + 1) && !isKingCheck(targetColIndex, targetRowIndex);
    } else if(pieceName === 'pawn') {
        // TODO : pour les 2 cases, verif si pas de piece 1 case au dessus

        /*
        attaque haut droite
        attaque haut gauche
        2 cases
        1 case
        */
        return targetColIndex === selectedPiece.colIndex! + 1 && targetRowIndex === selectedPiece.rowIndex! - 1 && ![undefined, -1].includes(boardPieces.value[selectedPiece.colIndex! + 1]![selectedPiece.rowIndex! - 1]!.playerId!) ||
        targetColIndex === selectedPiece.colIndex! - 1 && targetRowIndex === selectedPiece.rowIndex! - 1 && ![undefined, -1].includes(boardPieces.value[selectedPiece.colIndex! - 1]![selectedPiece.rowIndex! - 1]!.playerId!) ||
        targetColIndex === selectedPiece.colIndex && targetRowIndex === selectedPiece.rowIndex! - 2 && selectedPiece.rowIndex === 6 ||
        targetColIndex === selectedPiece.colIndex && targetRowIndex === selectedPiece.rowIndex! - 1;
    }
    return false;
};

const getImageUrl = (path: string): string => {
    return new URL(`/src/assets/images/pieces/${path}.png`, import.meta.url).href;
};
</script>

<style>
@import url('@assets/style/game.css');
</style>
