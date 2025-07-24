export default function dft(arr, a = 1, b = 1) {
    const N = arr.length;
    const output = [];

    for (let k = 0; k < N; k += a) { // Frequenzindex
        let real = 0;
        let imag = 0;

        for (let n = 0; n < N; n += b) { // Zeitindex
            const angle = (2 * Math.PI * k * n) / N;
            const value = arr[n]; // Hier arr[n] sollte Zahl sein!
            real += value * Math.cos(angle);
            imag -= value * Math.sin(angle);
        }

        output.push({ real, imag, amplitude: Math.sqrt(real * real + imag * imag) });
    }

    return output;
}
