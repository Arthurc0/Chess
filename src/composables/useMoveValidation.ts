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

    const isPieceBetweenInRow = (rowIndex: number, targetColIndex: number, currentColIndex: number): boolean => {
        const toLeft = targetColIndex < currentColIndex;
        let col = toLeft ? currentColIndex - 1 : currentColIndex + 1;
        while (toLeft ? col >= targetColIndex : col <= targetColIndex) {
            const foundPiece = chessBoardStore.getBoardPiece(col, rowIndex);
            if (foundPiece?.name) {
                if (chessBoardStore.isCurrentPlayer(foundPiece.playerId)) return true;
                if (col === targetColIndex) return false;
                return true;
            }
            toLeft ? col-- : col++;
        }
        return false;
    };

    const canPawnMove = (targetColIndex: number, targetRowIndex: number, selectedPiece: BoardPieceInterface) => {
        const isOpponent = chessBoardStore.isOpponentPiece(targetColIndex, targetRowIndex);
        const toUp = (selectedPiece.rowIndex === 6 && targetRowIndex === selectedPiece.rowIndex - 2 || targetRowIndex === selectedPiece.rowIndex - 1) && targetColIndex === selectedPiece.colIndex && !isPieceBetweenInColumn(targetColIndex, targetRowIndex, selectedPiece.rowIndex);
        const toUpRight = targetRowIndex === selectedPiece.rowIndex - 1 && targetColIndex === selectedPiece.colIndex + 1 && isOpponent;
        const toUpLeft = targetRowIndex === selectedPiece.rowIndex - 1 && targetColIndex === selectedPiece.colIndex - 1 && isOpponent;

        return toUp || toUpRight || toUpLeft;
    };

    const canKingMove = (targetColIndex: number, targetRowIndex: number, selectedPiece: BoardPieceInterface) => {
        const noCurrentPlayerPieceAround = !chessBoardStore.getBoardPiece(targetColIndex, targetRowIndex) || chessBoardStore.isOpponentPiece(targetColIndex, targetRowIndex);
        const sameColumn = targetColIndex === selectedPiece.colIndex;
        const sameRow = targetRowIndex === selectedPiece.rowIndex;
        const toUp = targetRowIndex === selectedPiece.rowIndex - 1 && noCurrentPlayerPieceAround;
        const toRight = targetColIndex === selectedPiece.colIndex + 1 && noCurrentPlayerPieceAround;
        const toDown = targetRowIndex === selectedPiece.rowIndex + 1 && noCurrentPlayerPieceAround;
        const toLeft = targetColIndex === selectedPiece.colIndex - 1 && noCurrentPlayerPieceAround;
        const toUpLeft = toUp && toLeft;
        const toUpRight = toUp && toRight;
        const toDownRight = toDown && toRight;
        const toDownLeft = toDown && toLeft;

        return toUp && sameColumn || toRight && sameRow || toDown && sameColumn || toLeft && sameRow || toUpLeft || toUpRight || toDownRight || toDownLeft;
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
            return canKingMove(targetColIndex, targetRowIndex, selectedPiece);
        } else if (pieceName === 'pawn') {
            return canPawnMove(targetColIndex, targetRowIndex, selectedPiece);
        }
        return false;
    };

    return {
        isValidMove
    };
};
