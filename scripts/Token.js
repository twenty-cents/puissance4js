class Token {
    constructor(row, col, status) {
        this.row = row;
        this.col = col;
        this.setStatus(status)
        //this.status = status;
        //this.renderStatus = "";
    }

    setStatus(newStatus) {
        this.status = newStatus;

        const tokenEl = document.createElement("span");
        tokenEl.classList.add("token");
        tokenEl.classList.add(this.status);
        
        this.rendererStatus = tokenEl;
    }
}