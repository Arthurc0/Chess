import type { BoardPieceInterface } from '@/interfaces/board/BoardPieceInterface';
import { useChessBoardStore } from '@/stores/chessBoardStore';
import { storeToRefs } from 'pinia';

export const useMoveValidation = () => {
    const chessBoardStore = useChessBoardStore();
    const { currentPlayerId } = storeToRefs(chessBoardStore);

    const canPawnMove = (targetColIndex: number, targetRowIndex: number, selectedPiece: BoardPieceInterface) => {
        const isOpponent = !chessBoardStore.isCurrentPlayer(chessBoardStore.getBoardPiece(targetColIndex, targetRowIndex)?.playerId ?? currentPlayerId.value);
        const noPieceInFront = chessBoardStore.getBoardPieceIndex(targetColIndex, targetRowIndex) === -1;
        const toUp = (selectedPiece.rowIndex === 6 && targetRowIndex === selectedPiece.rowIndex - 2 || targetRowIndex === selectedPiece.rowIndex - 1) && targetColIndex === selectedPiece.colIndex && noPieceInFront;
        const toUpRight = targetRowIndex === selectedPiece.rowIndex - 1 && targetColIndex === selectedPiece.colIndex + 1 && isOpponent;
        const toUpLeft = targetRowIndex === selectedPiece.rowIndex - 1 && targetColIndex === selectedPiece.colIndex - 1 && isOpponent;

        return toUp || toUpRight || toUpLeft;
    };

    const isValidMove = (targetColIndex: number, targetRowIndex: number, selectedPiece: BoardPieceInterface): boolean => {
        const pieceName = selectedPiece.name.split('-')?.[1] ?? '';

        if (pieceName === 'rook') {
            return true;
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
