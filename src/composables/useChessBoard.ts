import type { BoardPieceInterface } from '@/interfaces/board/BoardPieceInterface';
import type { Ref } from 'vue';
import { reactive } from 'vue';
import { onMounted, onUnmounted, computed, ref } from 'vue';
import { useMoveValidation } from '@/composables/useMoveValidation';
import { storeToRefs } from 'pinia';
import { useChessBoardStore } from '@/stores/chessBoardStore';

export const useChessBoard = (chessBoardElement: Ref<HTMLElement | undefined>) => {
    const pieceMovesCount = ref(1);
    const cellSize = computed(() => document.querySelector('.cell')!.clientWidth);
    const currentPlayerId = ref(1);
    const selectedPiece = reactive<BoardPieceInterface>({ colIndex: -1, name: '', rowIndex: -1, playerId: -1 });
    const chessBoardSize = computed(() => chessBoardElement.value!.clientWidth);
    const draggingPiece = ref(false);

    const chessBoardStore = useChessBoardStore();
    const { boardPieces, boardSquares } = storeToRefs(chessBoardStore);

    const getCellFromMousePosition = (mouseX: number, mouseY: number): { colIndex: number; rowIndex: number } => {
        let colIndex = Math.floor((mouseX - chessBoardElement.value!.offsetLeft + window.scrollX) / cellSize.value);
        let rowIndex = Math.floor((mouseY - chessBoardElement.value!.offsetTop + window.scrollY) / cellSize.value);

        // top corner
        if (mouseY - chessBoardElement.value!.offsetTop + window.scrollY <= 0) rowIndex = 0;
        // right corner
        if (mouseX - chessBoardElement.value!.offsetLeft + window.scrollX >= chessBoardSize.value) colIndex = 7;
        // bottom corner
        if (mouseY - chessBoardElement.value!.offsetTop + window.scrollY >= chessBoardSize.value) rowIndex = 7;
        // left corner
        if (mouseX - chessBoardElement.value!.offsetLeft + window.scrollX <= 0) colIndex = 0;

        return { colIndex, rowIndex };
    };

    const isCurrentPlayer = (playerId: number): boolean => {
        return playerId === currentPlayerId.value;
    };

    const unselectPiece = () => {
        if (selectedPiece.name) boardSquares.value[selectedPiece.colIndex]![selectedPiece.rowIndex]!.selected = false;
        Object.assign(selectedPiece, { colIndex: -1, name: '', rowIndex: -1 });
    };

    const setSelectedPiece = (piece: BoardPieceInterface) => {
        if (isCurrentPlayer(piece.playerId)) boardSquares.value[piece.colIndex]![piece.rowIndex]!.selected = true;
        Object.assign(selectedPiece, piece);
    };

    const getBoardPieceIndex = (colIndex: number, rowIndex: number): number => {
        return boardPieces.value.findIndex((p) => p.colIndex === colIndex && p.rowIndex === rowIndex);
    };

    const placeSelectedPiece = (colIndex: number, rowIndex: number) => {
        if (useMoveValidation().isValidMove(colIndex, rowIndex, selectedPiece)) {
            const selectedPieceIndex = getBoardPieceIndex(selectedPiece.colIndex, selectedPiece.rowIndex);
            boardPieces.value[selectedPieceIndex]!.colIndex = colIndex;
            boardPieces.value[selectedPieceIndex]!.rowIndex = rowIndex;
            boardSquares.value[selectedPiece.colIndex]![selectedPiece.rowIndex]!.playerId = undefined;
            boardSquares.value[selectedPiece.colIndex]![selectedPiece.rowIndex]!.name = '';
        }
    };

    const dropPiece = (e: DragEvent | MouseEvent, type: 'drag' | 'mouse'): void => {
        if (!isCurrentPlayer(selectedPiece.playerId)) return;
        draggingPiece.value = false;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const { colIndex, rowIndex } = getCellFromMousePosition(mouseX, mouseY);

        let piece = null;
        if (type === 'mouse') piece = (e as MouseEvent).relatedTarget as HTMLElement;
        else piece = (e as DragEvent).target as HTMLElement;

        piece.style.transform = `translate(${colIndex * 100}%, ${rowIndex * 100}%)`;
        placeSelectedPiece(colIndex, rowIndex);
        unselectPiece();
    };

    const mouseOver = (event: MouseEvent) => {
        if (draggingPiece.value) dropPiece(event, 'mouse');
    };

    onMounted(() => {
        document.addEventListener('mouseover', (event: MouseEvent) => {
            mouseOver(event);
        });
    });

    onUnmounted(() => {
        document.removeEventListener('mouseover', (event: MouseEvent) => {
            mouseOver(event);
        });
    });

    const movePiece = (e: DragEvent, piece: BoardPieceInterface): void => {
        if (!isCurrentPlayer(piece.playerId)) return;
        if (!draggingPiece.value) draggingPiece.value = true;

        let mouseX = e.clientX;
        let mouseY = e.clientY;

        if (mouseX !== 0 && mouseY !== 0) {
            // top corner
            if (mouseY - chessBoardElement.value!.offsetTop + window.scrollY <= 0) mouseY = chessBoardElement.value!.offsetTop - window.scrollY;
            // right corner
            if (mouseX - chessBoardElement.value!.offsetLeft + window.scrollX >= chessBoardSize.value) mouseX = chessBoardSize.value + chessBoardElement.value!.offsetLeft - window.scrollX;
            // bottom corner
            if (mouseY - chessBoardElement.value!.offsetTop + window.scrollY >= chessBoardSize.value) mouseY = chessBoardSize.value + chessBoardElement.value!.offsetTop - window.scrollY;
            // left corner
            if (mouseX - chessBoardElement.value!.offsetLeft + window.scrollX <= 0) mouseX = chessBoardElement.value!.offsetLeft - window.scrollX;

            const translatePosX = 50 * ((mouseX - chessBoardElement.value!.offsetLeft + window.scrollX) / (cellSize.value / 2) - 1);
            const translatePosY = 50 * ((mouseY - chessBoardElement.value!.offsetTop + window.scrollY) / (cellSize.value / 2) - 1);

            (e.target as HTMLElement).style.transform = `translate(${translatePosX}%, ${translatePosY}%)`;
        }
    };

    const pieceDragStyle = (e: DragEvent, piece: BoardPieceInterface): void => {
        e.dataTransfer!.setDragImage(e.target as HTMLElement, -9999, -9999);
        e.dataTransfer!.effectAllowed = 'move';
        unselectPiece();
        setSelectedPiece(piece);
        if (!isCurrentPlayer(piece.playerId)) return;
        document.documentElement.style.setProperty('--transition', 'none');
        (e.target as HTMLElement).style.zIndex = `${pieceMovesCount.value++}`;
    };

    const selectPiece = (piece: BoardPieceInterface): void => {
        // if no selected piece
        if (!selectedPiece.name) {
            if (isCurrentPlayer(piece.playerId)) {
                setSelectedPiece(piece);
            }
        } else {
            boardSquares.value[selectedPiece.colIndex]![selectedPiece.rowIndex]!.selected = false;

            // if not the same as current piece
            if (piece.colIndex !== selectedPiece.colIndex || piece.rowIndex !== selectedPiece.rowIndex) {
                if (isCurrentPlayer(boardPieces.value[getBoardPieceIndex(piece.colIndex, piece.rowIndex)]!.playerId)) {
                    setSelectedPiece(piece);
                } else unselectPiece();
            } else {
                unselectPiece();
            }
        }
    };

    const clickSquare = (colIndex: number, rowIndex: number): void => {
        if (selectedPiece.name && isCurrentPlayer(selectedPiece.playerId)) {
            document.documentElement.style.setProperty('--transition', 'transform 0.15s ease-in-out');
            placeSelectedPiece(colIndex, rowIndex);
            unselectPiece();
        }
    };

    return {
        movePiece,
        pieceDragStyle,
        dropPiece,
        selectPiece,
        clickSquare,
        isCurrentPlayer
    };
};
