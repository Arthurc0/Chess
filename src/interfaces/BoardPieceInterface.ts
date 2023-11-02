export interface BoardPieceInterface {
    name: string;
    playerId: number;
    selected?: boolean;
    colIndex: number;
    rowIndex: number;
}
