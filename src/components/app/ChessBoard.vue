<template>
    <div class="chess-board" ref="chessBoardElement" @drop="dropPiece" @dragover.prevent>
        <img class="piece" :class="piece.playerId === playerId ? 'cursor-grab' : 'cursor-default'" @click="selectPiece(piece)" @drag="pieceDragging($event, piece)" @dragstart="pieceDragStart($event, piece)" v-for="piece in boardPieces" :style="[{ transform: `translate(${piece.colIndex * 100}%, ${piece.rowIndex * 100}%)` }]" :src="getImageUrl(piece.name)" />
        <div v-for="(_1, colIndex) in boardSquares" :key="colIndex" class="column">
            <div v-for="(_2, rowIndex) in boardSquares" :key="`${colIndex}-${rowIndex}`" class="cell" :class="[(colIndex + rowIndex) % 2 === 0 ? 'light' : 'dark', boardSquares[colIndex]![rowIndex]!.selected ? 'selected' : '']" @click="clickSquare(colIndex, rowIndex)"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useChessBoard } from '@/composables/useChessBoard';
import type { BoardPieceInterface } from '@/interfaces/board/BoardPieceInterface';
import type { BoardSquareInterface } from '@/interfaces/board/BoardSquareInterface';
import { computed, ref } from 'vue';

const chessBoardElement = ref<HTMLElement>();
const chessBoard = useChessBoard(chessBoardElement);
const boardSquares = computed<BoardSquareInterface[][]>(() => chessBoard.boardSquares.value);
const boardPieces = computed<BoardPieceInterface[]>(() => chessBoard.boardPieces.value);

const clickSquare = (colIndex: number, rowIndex: number): void => {
    chessBoard.clickSquare(colIndex, rowIndex);
};

const pieceDragging = (e: DragEvent, piece: BoardPieceInterface): void => {
    chessBoard.movePiece(e, piece);
};

const pieceDragStart = (e: DragEvent, piece: BoardPieceInterface): void => {
    chessBoard.pieceDragStyle(e, piece);
};

const dropPiece = (e: DragEvent): void => {
    chessBoard.dropPiece(e, 'drag');
};

const selectPiece = (piece: BoardPieceInterface): void => {
    chessBoard.selectPiece(piece);
};

const playerId = 1;

/*
const selectedPiece = reactive<BoardPieceInterface>({ colIndex: -1, name: '', rowIndex: -1 });

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
    return false;
};

const isValidMove = (targetColIndex: number, targetRowIndex: number): boolean => {
    const pieceName: string = selectedPiece.name ? selectedPiece.name.split('-')[1]! : '';
    if(pieceName === 'rook') {
        return targetColIndex === selectedPiece.colIndex && !isPieceBetweenInColumn(targetColIndex, selectedPiece.rowIndex!, targetRowIndex) || targetRowIndex === selectedPiece.rowIndex && !isPieceBetweenInRow(targetRowIndex, selectedPiece.colIndex!, targetColIndex);
    } else if(pieceName === 'knight') {
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
        return (targetColIndex === selectedPiece.colIndex! + 1 && targetRowIndex === selectedPiece.rowIndex || targetColIndex === selectedPiece.colIndex! - 1 && targetRowIndex === selectedPiece.rowIndex || targetRowIndex === selectedPiece.rowIndex! + 1 && targetColIndex === selectedPiece.colIndex || targetRowIndex === selectedPiece.rowIndex! - 1 && targetColIndex === selectedPiece.colIndex || targetColIndex === selectedPiece.colIndex! + 1 && targetRowIndex === selectedPiece.rowIndex! - 1 || targetColIndex === selectedPiece.colIndex! - 1 && targetRowIndex === selectedPiece.rowIndex! - 1 || targetColIndex === selectedPiece.colIndex! + 1 && targetRowIndex === selectedPiece.rowIndex! + 1 || targetColIndex === selectedPiece.colIndex! - 1 && targetRowIndex === selectedPiece.rowIndex! + 1) && !isKingCheck(targetColIndex, targetRowIndex);
    } else if(pieceName === 'pawn') {
        return targetColIndex === selectedPiece.colIndex! + 1 && targetRowIndex === selectedPiece.rowIndex! - 1 && ![undefined, -1].includes(boardPieces.value[selectedPiece.colIndex! + 1]![selectedPiece.rowIndex! - 1]!.playerId!) ||
        targetColIndex === selectedPiece.colIndex! - 1 && targetRowIndex === selectedPiece.rowIndex! - 1 && ![undefined, -1].includes(boardPieces.value[selectedPiece.colIndex! - 1]![selectedPiece.rowIndex! - 1]!.playerId!) ||
        targetColIndex === selectedPiece.colIndex && targetRowIndex === selectedPiece.rowIndex! - 2 && selectedPiece.rowIndex === 6 ||
        targetColIndex === selectedPiece.colIndex && targetRowIndex === selectedPiece.rowIndex! - 1;
    }
    return false;
};
*/

const getImageUrl = (path: string): string => {
    return new URL(`/src/assets/images/pieces/${path}.png`, import.meta.url).href;
};
</script>

<style>
@import url('@/assets/style/game.css');
</style>
