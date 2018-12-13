export namespace Validaciones {

    export const esStringRequeridoValido = (value: string) => {

        if (!value) {
            return false;
        }

        if (value.trim().length < 1) {
            return false;
        }

        return true;
    }

    export const esNumeroRequeridoValido = (value: any, minValue?: number): boolean => {

        if (!value) {
            return false;
        }
        else {
            if (isNaN(value)) {
                return false;
            } else if (minValue && value && value < minValue) {
                return false;
            }
        }

        return true;
    }

    export const esNumeroOpcionalValido = (value: any, minValue?: number): boolean => {

        if (value) {
            if (isNaN(value)) {
                return false;
            } else if (minValue && value && value < minValue) {
                return false;
            }
        }

        return true;
    }

    export const generarGUID = () => {
        return 'xx-xxxxxxxxxx'.replace(/[x]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    export const generarFecha = (fecha: number) => {
        var myObj = JSON.parse('{"date_created":"' + fecha + '"}'),
            myDate = new Date(1000 * myObj.date_created);

        return myDate.toLocaleString('Es-es');
    }
}