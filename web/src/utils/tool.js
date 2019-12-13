export default {
    timestampToDateTime(nS) {
        let num = nS ? nS.toString() : '';
        let d;
        if (num.length === 10) {
            d = new Date(parseInt(nS) * 1000);
        }else if (num.length === 13) {
            d = new Date(parseInt(nS));
        } else {
            return NaN;
        }
        return d.getFullYear()+'.'+(d.getMonth()+1)+'.'+d.getDate()+' '+(d.getHours()>9?d.getHours():'0'+d.getHours())+':'+(d.getMinutes()>9?d.getMinutes():'0'+d.getMinutes());
    },
    timestampToDate(nS) {
        var num = nS.toString();
        let d;
        if (num.length === 10) {
            d = new Date(parseInt(nS) * 1000);
        }
        if (num.length === 13) {
            d = new Date(parseInt(nS));
        }
        return d.getFullYear()+'.'+(d.getMonth()+1)+'.'+d.getDate();
    },
}