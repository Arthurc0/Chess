<template>
    <div class="chess-board" ref="chessBoardElement" @drop="dropPiece" @dragover.prevent>
        <img class="piece" :class="isCurrentPlayer(piece.playerId) ? 'cursor-grab' : 'cursor-default'" @click="selectPiece(piece)" @drag="pieceDragging($event, piece)" @dragstart="pieceDragStart($event, piece)" v-for="piece in boardPieces" :style="[{ transform: `translate(${piece.colIndex * 100}%, ${piece.rowIndex * 100}%)` }]" :src="getImageUrl(piece.name)" />
        <div v-for="(_1, colIndex) in boardSquares" :key="colIndex" class="column">
            <div v-for="(_2, rowIndex) in boardSquares" :key="`${colIndex}-${rowIndex}`" class="cell" :class="[(colIndex + rowIndex) % 2 === 0 ? 'light' : 'dark', boardSquares[colIndex]![rowIndex]!.selected ? 'selected' : '']" @click="clickSquare(colIndex, rowIndex)"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useChessBoard } from '@/composables/useChessBoard';
import { useChessBoardStore } from '@/stores/chessBoardStore';
import type { BoardPieceInterface } from '@/interfaces/board/BoardPieceInterface';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

const chessBoardElement = ref<HTMLElement>();
const chessBoard = useChessBoard(chessBoardElement);

const chessBoardStore = useChessBoardStore();
const { boardPieces, boardSquares } = storeToRefs(chessBoardStore);

const isCurrentPlayer = (playerId: number): boolean => {
    return chessBoard.isCurrentPlayer(playerId);
};

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

const getImageUrl = (path: string): string => {
    return new URL(`/src/assets/images/pieces/${path}.png`, import.meta.url).href;
};
</script>

<style>
@import url('@/assets/style/game.css');
</style>
