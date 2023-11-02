import type { BoardSquareInterface } from '@interfaces/BoardSquareInterface';
import type { Ref } from 'vue';
import { onMounted } from 'vue';
import { ref } from 'vue';

export const useChessBoard = (chessBoardElement: Ref<HTMLElement | undefined>) => {
    const pieceMovesCount = ref(1);
    const cellSize = ref(0);
    const currentPlayerId = ref(1);

    onMounted(() => {
        cellSize.value = document.querySelector('.cell')!.getBoundingClientRect().width;
    });

    const getCellFromMousePosition = (mouseX: number, mouseY: number): { colIndex: number; rowIndex: number } => {
        let colIndex = Math.floor((mouseX - chessBoardElement.value!.offsetLeft + window.scrollX) / cellSize.value);
        let rowIndex = Math.floor((mouseY - chessBoardElement.value!.offsetTop + window.scrollY) / cellSize.value);
        if(mouseX < chessBoardElement.value!.offsetLeft - window.scrollX) colIndex = 0;
        if(mouseY < chessBoardElement.value!.offsetTop - window.scrollY) rowIndex = 0;
        if(mouseX > chessBoardElement.value!.clientWidth + chessBoardElement.value!.offsetLeft - window.scrollX) colIndex = 7;
        if(mouseY > chessBoardElement.value!.clientHeight + chessBoardElement.value!.offsetTop - window.scrollY) rowIndex = 7;
        return { colIndex, rowIndex };
    };

    const isCurrentPlayer = (playerId: number): boolean => {
        return playerId === currentPlayerId.value;
    };

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
            const piece = e.target as HTMLElement;

            let mouseX = e.clientX;
            let mouseY = e.clientY;

            if(mouseX !== 0 && mouseY !== 0) {
                if(mouseX < chessBoardElement.value!.offsetLeft - window.scrollX) mouseX = chessBoardElement.value!.offsetLeft - window.scrollX;
                if(mouseY < chessBoardElement.value!.offsetTop - window.scrollY) mouseY = chessBoardElement.value!.offsetTop - window.scrollY;
                if(mouseX > chessBoardElement.value!.clientWidth + chessBoardElement.value!.offsetLeft - window.scrollX) mouseX = chessBoardElement.value!.clientWidth + chessBoardElement.value!.offsetLeft - window.scrollX;
                if(mouseY > chessBoardElement.value!.clientHeight + chessBoardElement.value!.offsetTop - window.scrollY) mouseY = chessBoardElement.value!.clientHeight + chessBoardElement.value!.offsetTop - window.scrollY;
                piece.style.left = `calc(${mouseX - chessBoardElement.value!.offsetLeft + window.scrollX}px - (var(--cell-size) / 2))`;
                piece.style.top = `calc(${mouseY - chessBoardElement.value!.offsetTop + window.scrollY}px - (var(--cell-size) / 2))`;
            }
        },
        pieceDragStyle(e: DragEvent): void {
            e.dataTransfer!.effectAllowed = 'move';
            e.dataTransfer!.setDragImage(e.target as HTMLElement, -9999, -9999);
            (e.target as HTMLElement).style.zIndex = `${pieceMovesCount.value++}`;
        },
        dropPiece(e: DragEvent): void {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            const { colIndex, rowIndex } = getCellFromMousePosition(mouseX, mouseY);
            const piece = e.target as HTMLElement;
            piece.style.left = `calc(var(--cell-size) * ${colIndex})`;
            piece.style.top = `calc(var(--cell-size) * ${rowIndex})`;
        }
    };
};
