<template>
    <div class="chess-board" ref="chessBoardElement" @drop="pieceDrop" @dragover.prevent>
        <img class="piece" :class="piece.playerId === playerId ? 'cursor-grab' : 'cursor-default'" @click="selectPiece(piece)" @drag="pieceDragging($event, piece.playerId)" @dragstart="pieceDragStart" v-for="piece in boardPieces"
        :style="[
            { 'transform': `translate(${piece.colIndex * 100}%, ${piece.rowIndex * 100}%)` }
        ]" :src="getImageUrl(piece.name)" />
        <div v-for="(_, colIndex) in boardSquares" class="column">
            <div v-for="(_, rowIndex) in boardSquares" :key="`${colIndex}-${rowIndex}`" class="cell" :class="[(colIndex + rowIndex) % 2 === 0 ? 'light' : 'dark', boardSquares[colIndex]![rowIndex]!.selected ? 'selected' : '']"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useChessBoard } from '@composables/useChessBoard';
import type { BoardPieceInterface } from '@interfaces/BoardPieceInterface';
import type { BoardSquareInterface } from '@interfaces/BoardSquareInterface';
import { computed, reactive, ref } from 'vue';

const chessBoardElement = ref<HTMLElement>();
const chessBoard = useChessBoard(chessBoardElement);
const boardSquares = computed<BoardSquareInterface[][]>(() => chessBoard.boardSquares.value);
const boardPieces = computed<BoardPieceInterface[]>(() => chessBoard.boardPieces.value);

const pieceDragging = (e: DragEvent, piecePlayer: number): void => {
    chessBoard.setPiecePosition(e, piecePlayer);
};

const pieceDragStart = (e: DragEvent): void => {
    chessBoard.pieceDragStyle(e);
};

const pieceDrop = (e: DragEvent): void => {
    chessBoard.dropPiece(e);
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
