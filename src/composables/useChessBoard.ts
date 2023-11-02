import type { BoardSquareInterface } from '@interfaces/BoardSquareInterface';
import type { Ref } from 'vue';
import { onMounted, onUnmounted, computed, ref } from 'vue';

export const useChessBoard = (chessBoardElement: Ref<HTMLElement | undefined>) => {
    const pieceMovesCount = ref(1);
    const cellSize = computed(() => document.querySelector('.cell')!.clientWidth);
    const currentPlayerId = ref(1);
    const chessBoardSize = computed(() => chessBoardElement.value!.clientWidth);
    const draggingPiece = ref(false);

    const getCellFromMousePosition = (mouseX: number, mouseY: number): { colIndex: number; rowIndex: number } => {
        let colIndex = Math.floor((mouseX - chessBoardElement.value!.offsetLeft + window.scrollX) / cellSize.value);
        let rowIndex = Math.floor((mouseY - chessBoardElement.value!.offsetTop + window.scrollY) / cellSize.value);

        // top corner
        if(mouseY - chessBoardElement.value!.offsetTop + window.scrollY <= 0) rowIndex = 0;
        // right corner
        if(mouseX - chessBoardElement.value!.offsetLeft + window.scrollX >= chessBoardSize.value) colIndex = 7;
        // bottom corner
        if(mouseY - chessBoardElement.value!.offsetTop + window.scrollY >= chessBoardSize.value) rowIndex = 7;
        // left corner
        if(mouseX - chessBoardElement.value!.offsetLeft + window.scrollX <= 0) colIndex = 0;

        return { colIndex, rowIndex };
    };

    const isCurrentPlayer = (playerId: number): boolean => {
        return playerId === currentPlayerId.value;
    };

    const dropPiece = (e: DragEvent | MouseEvent, type: 'drag' | 'mouse'): void => {
        draggingPiece.value = false;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const { colIndex, rowIndex } = getCellFromMousePosition(mouseX, mouseY);

        let piece = null;
        if(type === 'mouse') piece = (e as MouseEvent).relatedTarget as HTMLElement;
        else piece = (e as DragEvent).target as HTMLElement;

        piece.style.transform = `translate(${colIndex * 100}%, ${rowIndex * 100}%)`;
    };

    const mouseOver = (event: MouseEvent) => {
        if(draggingPiece.value) dropPiece(event, 'mouse');
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

    return {
        boardSquares: ref<BoardSquareInterface[][]>([
            [{ name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }],
            [{ name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }],
            [{ name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }],
            [{ name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }],
            [{ name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }],
            [{ name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }],
            [{ name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }],
            [{ name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }, { name: '' }]
        ]),
        boardPieces: ref([
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
        ]),
        setPiecePosition(e: DragEvent, piecePlayer: number): void {
            if(!isCurrentPlayer(piecePlayer)) return;
            if(!draggingPiece.value) draggingPiece.value = true;
            const piece = e.target as HTMLElement;

            let mouseX = e.clientX;
            let mouseY = e.clientY;

            if(mouseX !== 0 && mouseY !== 0) {
                // top corner
                if(mouseY - chessBoardElement.value!.offsetTop + window.scrollY <= 0) mouseY = chessBoardElement.value!.offsetTop - window.scrollY;
                // right corner
                if(mouseX - chessBoardElement.value!.offsetLeft + window.scrollX >= chessBoardSize.value) mouseX = chessBoardSize.value + chessBoardElement.value!.offsetLeft - window.scrollX;
                // bottom corner
                if(mouseY - chessBoardElement.value!.offsetTop + window.scrollY >= chessBoardSize.value) mouseY = chessBoardSize.value + chessBoardElement.value!.offsetTop - window.scrollY;
                // left corner
                if(mouseX - chessBoardElement.value!.offsetLeft + window.scrollX <= 0) mouseX = chessBoardElement.value!.offsetLeft - window.scrollX;

                const translatePosX = 50 * ((mouseX - chessBoardElement.value!.offsetLeft + window.scrollX) / (cellSize.value / 2) - 1);
                const translatePosY = 50 * ((mouseY - chessBoardElement.value!.offsetTop + window.scrollY) / (cellSize.value / 2) - 1);

                piece.style.transform = `translate(${translatePosX}%, ${translatePosY}%)`;
            }
        },
        pieceDragStyle(e: DragEvent): void {
            e.dataTransfer!.effectAllowed = 'move';
            e.dataTransfer!.setDragImage(e.target as HTMLElement, -9999, -9999);
            (e.target as HTMLElement).style.zIndex = `${pieceMovesCount.value++}`;
        },
        dropPiece
    };
};
