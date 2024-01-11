import type { BoardPieceInterface } from '@/interfaces/board/BoardPieceInterface';
import { useChessBoardStore } from '@/stores/chessBoardStore';
import { storeToRefs } from 'pinia';

export const useMoveValidation = () => {
    const chessBoardStore = useChessBoardStore();
    const { currentPlayerId, boardSquares } = storeToRefs(chessBoardStore);

    const isPieceBetweenInColumn = (colIndex: number, targetRowIndex: number, currentRowIndex: number): boolean => {
        const toUp = targetRowIndex < currentRowIndex;
        let row = toUp ? currentRowIndex - 1 : currentRowIndex + 1;
        while (toUp ? row >= targetRowIndex : row <= targetRowIndex) {
            const foundPiece = chessBoardStore.getBoardPiece(colIndex, row);
            if (foundPiece?.name) {
                if (chessBoardStore.isCurrentPlayer(foundPiece.playerId)) return true;
                if (row === targetRowIndex) return false;
                return true;
            }
            toUp ? row-- : row++;
        }
        return false;
    };

    const isPieceBetweenInRow = (rowIndex: number, firstIndex: number, secondIndex: number): boolean => {
        const pos = [firstIndex, secondIndex].sort((a, b) => a - b);
        return boardSquares.value.findIndex((val, index) => val[rowIndex]?.name.length && index > pos[0]! && index < pos[1]!) !== -1;
    };

    const canPawnMove = (targetColIndex: number, targetRowIndex: number, selectedPiece: BoardPieceInterface) => {
        const isOpponent = chessBoardStore.isOpponentPiece(targetColIndex, targetRowIndex);
        const noPieceInFront = !chessBoardStore.getBoardPiece(targetColIndex, targetRowIndex)?.name;
        const toUp = (selectedPiece.rowIndex === 6 && targetRowIndex === selectedPiece.rowIndex - 2 || targetRowIndex === selectedPiece.rowIndex - 1) && targetColIndex === selectedPiece.colIndex && noPieceInFront;
        const toUpRight = targetRowIndex === selectedPiece.rowIndex - 1 && targetColIndex === selectedPiece.colIndex + 1 && isOpponent;
        const toUpLeft = targetRowIndex === selectedPiece.rowIndex - 1 && targetColIndex === selectedPiece.colIndex - 1 && isOpponent;

        return toUp || toUpRight || toUpLeft;
    };

    const canRookMove = (targetColIndex: number, targetRowIndex: number, selectedPiece: BoardPieceInterface) => {
        const vertical = targetColIndex === selectedPiece.colIndex && !isPieceBetweenInColumn(targetColIndex, targetRowIndex, selectedPiece.rowIndex);
        const horizontal = targetRowIndex === selectedPiece.rowIndex && !isPieceBetweenInRow(targetRowIndex, targetColIndex, selectedPiece.colIndex);

        return vertical || horizontal;
    };

    const isValidMove = (targetColIndex: number, targetRowIndex: number, selectedPiece: BoardPieceInterface): boolean => {
        if (targetColIndex === selectedPiece.colIndex && targetRowIndex === selectedPiece.rowIndex) return false;
        const pieceName = selectedPiece.name.split('-')?.[1] ?? '';

        if (pieceName === 'rook') {
            return canRookMove(targetColIndex, targetRowIndex, selectedPiece);
        } else if (pieceName === 'knight') {
            return true;
        } else if (pieceName === 'bishop') {
            return true;
        } else if (pieceName === 'queen') {
            return true;
        } else if (pieceName === 'king') {
            return true;
        } else if (pieceName === 'pawn') {
            return canPawnMove(targetColIndex, targetRowIndex, selectedPiece);
        }
        return false;
    };

    return {
        isValidMove
    };
};
