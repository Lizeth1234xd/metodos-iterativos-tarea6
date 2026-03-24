// Configuración inicial del sistema 5x5
const MATRIZ_DEFECTO = [
    [10, -2, 0, 0, -3],
    [-2, 13, -1, -5, 0],
    [0, -1, 6, -1, -1],
    [0, -5, -1, 14, -2],
    [-3, 0, -1, -2, 9]
];

const VECTOR_DEFECTO = [12, 0, 0, 0, 0];
const ETIQUETAS = ["I₁", "I₂", "I₃", "I₄", "I₅"];
const TAMANIO = 5;

// Generar tabla de entrada en el HTML
function generarTablaEntrada() {
    const cuerpo = document.getElementById('cuerpoTabla');
    cuerpo.innerHTML = '';
    
    for (let fila = 0; fila < TAMANIO; fila++) {
        let html = `<td><strong>E${fila+1}</strong></td>`;
        
        for (let col = 0; col < TAMANIO; col++) {
            html += `<td><input type="number" id="m${fila}${col}" value="${MATRIZ_DEFECTO[fila][col]}"></td>`;
        }
        
        html += `<td class="col-b"><input type="number" id="v${fila}" value="${VECTOR_DEFECTO[fila]}"></td>`;
        
        const tr = document.createElement('tr');
        tr.innerHTML = html;
        cuerpo.appendChild(tr);
    }
}

// Resetear a valores por defecto
function reiniciarValores() {
    for (let i = 0; i < TAMANIO; i++) {
        for (let j = 0; j < TAMANIO; j++) {
            document.getElementById(`m${i}${j}`).value = MATRIZ_DEFECTO[i][j];
        }
        document.getElementById(`v${i}`).value = VECTOR_DEFECTO[i];
    }
    document.getElementById('paramOmega').value = 1.2;
    document.getElementById('paramTol').value = 0.000001;
    document.getElementById('paramIter').value = 50;
    document.getElementById('seccionResultados').classList.add('oculto');
    document.getElementById('mensajeAlerta').innerHTML = '';
}

// Leer datos desde la interfaz
function obtenerDatos() {
    const A = [], b = [];
    for (let i = 0; i < TAMANIO; i++) {
        A.push([]);
        for (let j = 0; j < TAMANIO; j++) {
            A[i].push(parseFloat(document.getElementById(`m${i}${j}`).value) || 0);
        }
        b.push(parseFloat(document.getElementById(`v${i}`).value) || 0);
    }
    return { matriz: A, vector: b };
}

// Operaciones básicas con vectores
function sumarVectores(a, b) { return a.map((v, i) => v + b[i]); }
function restarVectores(a, b) { return a.map((v, i) => v - b[i]); }
function escalarVector(v, k) { return v.map(x => x * k); }
function productoPunto(a, b) { return a.reduce((s, val, i) => s + val * b[i], 0); }
function normaVector(v) { return Math.sqrt(productoPunto(v, v)); }
function multiplicarMatrizVector(M, v) { return M.map(fila => productoPunto(fila, v)); }

// Solución exacta por eliminación gaussiana (CORREGIDO)
function resolverExacto(A, b) {
    const n = b.length;
    const U = A.map(f => [...f]);
    const L = Array.from({length: n}, () => Array(n).fill(0));
    
    for (let k = 0; k < n; k++) {
        for (let i = k + 1; i < n; i++) {
            const factor = U[i][k] / U[k][k];
            L[i][k] = factor;
            for (let j = k; j < n; j++) {
                U[i][j] -= factor * U[k][j];
            }
        }
    }
    
    const y = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        y[i] = b[i];
        for (let j = 0; j < i; j++) {  // ✅ CORREGIDO: ahora tiene j++
            y[i] -= L[i][j] * y[j];
        }
    }
    
    const x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        x[i] = y[i] / U[i][i];
        for (let j = i + 1; j < n; j++) {
            x[i] -= U[i][j] * x[j] / U[i][i];
        }
    }
    return x;
}

// Calcular error relativo
function calcularError(nuevo, anterior) {
    const diff = normaVector(restarVectores(nuevo, anterior));
    const denom = normaVector(nuevo);
    return denom < 1e-14 ? 1 : diff / denom;
}

// Método Gauss-Seidel
function metodoGS(A, b, tol, maxIter) {
    const n = b.length;
    const historial = [];
    let solucion = Array(n).fill(0);
    
    for (let k = 1; k <= maxIter; k++) {
        const anterior = [...solucion];
        
        for (let i = 0; i < n; i++) {
            let suma = b[i];
            for (let j = 0; j < n; j++) {
                if (j !== i) suma -= A[i][j] * solucion[j];
            }
            solucion[i] = suma / A[i][i];
        }
        
        const error = calcularError(solucion, anterior);
        historial.push({ iter: k, valores: [...solucion], error });
        if (error < tol) break;
    }
    return historial;
}

// Método SOR
function metodoSOR(A, b, omega, tol, maxIter) {
    const n = b.length;
    const historial = [];
    let solucion = Array(n).fill(0);
    
    for (let k = 1; k <= maxIter; k++) {
        const anterior = [...solucion];
        
        for (let i = 0; i < n; i++) {
            let suma = b[i];
            for (let j = 0; j < n; j++) {
                if (j !== i) suma -= A[i][j] * solucion[j];
            }
            const gs = suma / A[i][i];
            solucion[i] = (1 - omega) * anterior[i] + omega * gs;
        }
        
        const error = calcularError(solucion, anterior);
        historial.push({ iter: k, valores: [...solucion], error });
        if (error < tol) break;
    }
    return historial;
}

// Método Gradiente Conjugado
function metodoCG(A, b, tol, maxIter) {
    const n = b.length;
    const historial = [];
    let x = Array(n).fill(0);
    let r = [...b];
    let p = [...b];
    
    for (let k = 1; k <= maxIter; k++) {
        const Ap = multiplicarMatrizVector(A, p);
        const rr = productoPunto(r, r);
        const alpha = rr / productoPunto(p, Ap);
        
        x = sumarVectores(x, escalarVector(p, alpha));
        const rNuevo = restarVectores(r, escalarVector(Ap, alpha));
        const beta = productoPunto(rNuevo, rNuevo) / rr;
        
        p = sumarVectores(rNuevo, escalarVector(p, beta));
        r = rNuevo;
        
        const error = normaVector(r);
        historial.push({ iter: k, valores: [...x], error, alpha, beta });
        if (error < tol) break;
    }
    return historial;
}

// Formatear números para mostrar
function formatoNumero(v, dec = 6) {
    return typeof v === 'number' ? v.toFixed(dec) : v;
}

function formatoCientifico(v) {
    return typeof v === 'number' ? v.toExponential(2) : v;
}

// Mostrar resumen de resultados
function mostrarResumen(id, iters, errorFinal, solucion, exacta) {
    const erroresAbs = solucion.map((v, i) => Math.abs(v - (exacta ? exacta[i] : v)));
    const maxError = Math.max(...erroresAbs);
    
    let html = `
        <div class="stat-box"><div class="valor">${iters}</div><div class="etiqueta">Iteraciones</div></div>
        <div class="stat-box"><div class="valor">${formatoCientifico(errorFinal)}</div><div class="etiqueta">Error</div></div>
        <div class="stat-box"><div class="valor">${formatoCientifico(maxError)}</div><div class="etiqueta">Err. máx</div></div>
    `;
    
    solucion.forEach((v, i) => {
        html += `<div class="stat-box"><div class="valor">${formatoNumero(v, 5)}</div><div class="etiqueta">${ETIQUETAS[i]}</div></div>`;
    });
    
    document.getElementById(id).innerHTML = html;
}

// Generar tabla de iteraciones
function generarTabla(id, historial, esCG, iterConv) {
    const tabla = document.getElementById(id);
    const encabezados = esCG 
        ? ['Iter', ...ETIQUETAS, '‖r‖', 'α', 'β']
        : ['Iter', ...ETIQUETAS, 'Error'];
    
    let html = `<thead><tr>${encabezados.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>`;
    
    historial.forEach(h => {
        const clase = h.iter >= iterConv ? 'convergencia' : '';
        let celdas = [h.iter, ...h.valores.map(v => formatoNumero(v, 6))];
        
        if (esCG) {
            celdas.push(formatoCientifico(h.error), formatoNumero(h.alpha, 6), formatoNumero(h.beta, 6));
        } else {
            celdas.push(formatoCientifico(h.error));
        }
        
        html += `<tr class="${clase}">${celdas.map(c => `<td>${c}</td>`).join('')}</tr>`;
    });
    
    html += '</tbody>';
    tabla.innerHTML = html;
}

// Generar tabla comparativa (Tarea 7)
function generarComparativa(resultados, exacta) {
    const { gs, sor: histSOR, cg } = resultados;
    const solGS = gs[gs.length-1].valores;
    const solSOR = histSOR[histSOR.length-1].valores;
    const solCG = cg[cg.length-1].valores;
    
    const itGS = gs.length, itSOR = histSOR.length, itCG = cg.length;
    const errGS = gs[gs.length-1].error, errSOR = histSOR[histSOR.length-1].error, errCG = cg[cg.length-1].error;
    
    let html = `<thead><tr><th>Variable</th><th>Exacta</th><th style="background:#2E8B57;">G-S</th><th style="background:#FFA500;">SOR</th><th style="background:#9370DB;">G.C.</th></tr></thead><tbody>`;
    
    for (let i = 0; i < TAMANIO; i++) {
        html += `<tr>
            <td><strong>${ETIQUETAS[i]}</strong></td>
            <td style="background:#e8f5e9;font-weight:bold;">${formatoNumero(exacta[i], 8)}</td>
            <td>${formatoNumero(solGS[i], 8)}</td>
            <td>${formatoNumero(solSOR[i], 8)}</td>
            <td>${formatoNumero(solCG[i], 8)}</td>
        </tr>`;
    }
    
    const minIter = Math.min(itGS, itSOR, itCG);
    const minErr = Math.min(errGS, errSOR, errCG);
    
    html += `<tr style="background:#f5f5f5;font-weight:bold;">
        <td>Iteraciones</td><td>-</td>
        <td class="${itGS===minIter?'mejor':''}">${itGS}</td>
        <td class="${itSOR===minIter?'mejor':''}">${itSOR}</td>
        <td class="${itCG===minIter?'mejor':''}">${itCG}</td>
    </tr>
    <tr style="background:#f5f5f5;font-weight:bold;">
        <td>Error</td><td>0</td>
        <td class="${errGS===minErr?'mejor':''}">${formatoCientifico(errGS)}</td>
        <td class="${errSOR===minErr?'mejor':''}">${formatoCientifico(errSOR)}</td>
        <td class="${errCG===minErr?'mejor':''}">${formatoCientifico(errCG)}</td>
    </tr></tbody>`;
    
    document.getElementById('tablaComparativa').innerHTML = html;
    
    const masRapido = ['G-S', 'SOR', 'G.C.'][[itGS, itSOR, itCG].indexOf(minIter)];
    const masPreciso = ['G-S', 'SOR', 'G.C.'][[errGS, errSOR, errCG].indexOf(minErr)];
    
    document.getElementById('analisisComparativo').innerHTML = `
        <strong>Análisis:</strong><br>
        • Más rápido: ${masRapido} (${minIter} iter)<br>
        • Más preciso: ${masPreciso} (${formatoCientifico(minErr)})<br>
        • Matriz diagonal dominante → convergencia garantizada para G-S y SOR.
    `;
}

// Función principal de cálculo
function ejecutarCalculo() {
    const { matriz: A, vector: b } = obtenerDatos();
    const omega = parseFloat(document.getElementById('paramOmega').value);
    const tol = parseFloat(document.getElementById('paramTol').value);
    const maxIter = parseInt(document.getElementById('paramIter').value);
    const alerta = document.getElementById('mensajeAlerta');
    
    // Validaciones
    if (omega <= 0 || omega >= 2) {
        alerta.innerHTML = '<div class="alerta alerta-error">ω debe estar entre 0 y 2</div>';
        return;
    }
    for (let i = 0; i < TAMANIO; i++) {
        if (A[i][i] === 0) {
            alerta.innerHTML = '<div class="alerta alerta-error">Diagonal con ceros</div>';
            return;
        }
    }
    alerta.innerHTML = '';
    
    // Calcular
    const exacta = resolverExacto(A.map(f => [...f]), b);
    const histGS = metodoGS(A, b, tol, maxIter);
    const histSOR = metodoSOR(A, b, omega, tol, maxIter);
    const histCG = metodoCG(A, b, tol, maxIter);
    
    // Mostrar resultados
    mostrarResumen('statsGS', histGS.length, histGS[histGS.length-1].error, histGS[histGS.length-1].valores, exacta);
    mostrarResumen('statsSOR', histSOR.length, histSOR[histSOR.length-1].error, histSOR[histSOR.length-1].valores, exacta);
    mostrarResumen('statsCG', histCG.length, histCG[histCG.length-1].error, histCG[histCG.length-1].valores, exacta);
    
    const convGS = histGS.findIndex(h => h.error < tol) + 1 || histGS.length;
    const convSOR = histSOR.findIndex(h => h.error < tol) + 1 || histSOR.length;
    const convCG = histCG.findIndex(h => h.error < tol) + 1 || histCG.length;
    
    generarTabla('tablaGS', histGS, false, convGS);
    generarTabla('tablaSOR', histSOR, false, convSOR);
    generarTabla('tablaCG', histCG, true, convCG);
    generarComparativa({ gs: histGS, sor: histSOR, cg: histCG }, exacta);
    
    document.getElementById('seccionResultados').classList.remove('oculto');
    document.getElementById('seccionResultados').scrollIntoView({ behavior: 'smooth' });
}

// Cambiar entre pestañas
function cambiarPestana(targetId) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('activo'));
    document.querySelectorAll('.contenido-metodo').forEach(el => el.classList.remove('visible'));
    
    event.currentTarget.classList.add('activo');
    document.getElementById(targetId).classList.add('visible');
}

// Inicializar al cargar
generarTablaEntrada();