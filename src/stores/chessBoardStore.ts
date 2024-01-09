import type { BoardPieceInterface } from '@/interfaces/board/BoardPieceInterface';
import type { BoardSquareInterface } from '@/interfaces/board/BoardSquareInterface';
import { defineStore } from 'pinia';

export const useChessBoardStore = defineStore('chessBoard', {
    state: () => ({
        boardSquares: [
            [{ name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }],
            [{ name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }],
            [{ name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }],
            [{ name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }],
            [{ name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }],
            [{ name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }],
            [{ name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }],
            [{ name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }]
        ] as BoardSquareInterface[][],
        boardPieces: [
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
        ] as BoardPieceInterface[]
    }),
    actions: {},
    getters: {}
});
