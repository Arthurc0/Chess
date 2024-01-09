import type { BoardPieceInterface } from '@/interfaces/board/BoardPieceInterface';

export const useMoveValidation = () => {
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
            return true;
        }
        return false;
    };

    return {
        isValidMove
    };
};