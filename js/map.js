var createMap = function(x, y) {
    this.x = x;
    this.y = y;
    this.array = [];

    for (i = 0; i < this.x; i++) {
        this.arr = [];
        for (j = 0; j < this.y; j++) {
            if (i == 0 || i == this.x - 1 || j == 0 || j == this.y - 1) {
                arr.push(1);
            } else if (true) {
              
            }else {
                arr.push(0);
            }
        }
        this.array.push(arr);
    }




    return this.array;
}
