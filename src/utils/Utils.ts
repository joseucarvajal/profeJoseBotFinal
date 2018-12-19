export namespace Utils {
    export const getRealDate = (msgDate:number) : Date => {
        return new Date(1000*msgDate);
    }
}