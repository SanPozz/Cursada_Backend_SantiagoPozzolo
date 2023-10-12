class Calculadora {
    
    sumar(a, b) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (a == 0 || b == 0) {
                    reject("Operacion innecesaria")
                } else if (a + b < 0) {
                    reject("La calculadora sólo debe devolver valores positivos")
                } else {
                    resolve(a + b)
                }
            }, 2000)
        })
    }

    restar(a, b) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (a == 0 || b == 0) {
                    reject("Operacion invalida")
                } else if (a - b < 0) {
                    reject("La calculadora debe devolver valores positivos")
                } else {
                    resolve(a - b)
                }
            }, 2000)
        })
    }

    multiplicar(a, b) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (a <= 0 || b <= 0) {
                    reject("Operacion invalida")
                } else if (a * b < 0) {
                    reject("La calculadora debe devolver valores positivos")
                } else {
                    resolve(a * b)
                }
            }, 2000)
        })
    }

    dividir(a, b) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (a == 0 || b == 0) {
                    reject("Operacion invalida")
                } else if (a / b < 0) {
                    reject("La calculadora debe devolver valores positivos")
                } else {
                    resolve(a / b)
                }
            }, 2000)
        })
    }
}

const calculadora = new Calculadora()

const calculos = async () => {
    try {
        let resultado = await calculadora.sumar(1, 2)
        console.log(resultado);
        resultado = await calculadora.restar(4, 2)
        console.log(resultado);
        resultado = await calculadora.multiplicar(1, 2)
        console.log(resultado);
        resultado = await calculadora.dividir(6, 2)
        console.log(resultado);
    } catch (error) {
        console.log(error);
    }
}

calculos();