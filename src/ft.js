import { create, all } from 'mathjs';
    function dft(arr, a = 1, b = 1) {
    const N = arr.lenght;
    const output = [];

    for (let k = 0; k < N; k += a) { // Frequenzindex
        let real = 0;
        let imag = 0;
        
        for (let n = 0; n < N; n += b) { // Zeitindex
            const angle = (2 * Math.PI * k * n) / N;
            real += input[n] * Math.cos(angle);
            imag -= input[n] * Math.sin(angle);
        }
        
        output[k] = { real: real, imag: imag, amplitude: Math.sqrt(real * real + imag * imag) };
    }
    return output;
}