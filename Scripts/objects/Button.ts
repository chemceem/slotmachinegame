module objects {
export class Button {

    // Instance variables for the Button Class
    private _buttonImage: createjs.Bitmap;
    private _x: number;
    private _y: number;

    constructor(path: string, x: number, y: number) {
        //To set the location of the button within the canvas
        this.setX(x);
        this.setY(y);

        this._buttonImage = new createjs.Bitmap(path);
        this._buttonImage.x = this._x;
        this._buttonImage.y = this._y;
        this._buttonImage.addEventListener("mouseover", this._buttonOver);
        this._buttonImage.addEventListener("mouseout", this._buttonOut);
    }

    // Properties to access the buttons from game.ts file
    public getImage(): createjs.Bitmap {

        return this._buttonImage;
    }
    
    public getX(): number {
        return this._x;
    }

    public getY(): number {
        return this._y;
    }

    public setX(x: number) {
        this._x = x;
    }

    public setY(y: number) {
        this._y = y;
    }

    //Event Handlers for fading the button when the mouse enters and leaves
    private _buttonOut(event: createjs.MouseEvent): void {
        event.currentTarget.alpha = 1.0;
    }

    private _buttonOver(event: createjs.MouseEvent): void {
        event.currentTarget.alpha = 0.5;
    }

} 

}