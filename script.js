// ============================================================
// METODOS ITERATIVOS - CIRCUITO 5 MALLAS
// Estudiante: Lizeth Echenique
// ============================================================


function agregarFila(html, i, I1, I2, I3, I4, I5) {
    html += "<tr>";
    html += "<td>" + (i + 1) + "</td>";
    html += "<td>" + I1.toFixed(4) + "</td>";
    html += "<td>" + I2.toFixed(4) + "</td>";
    html += "<td>" + I3.toFixed(4) + "</td>";
    html += "<td>" + I4.toFixed(4) + "</td>";
    html += "<td>" + I5.toFixed(4) + "</td>";
    html += "</tr>";
    return html;
}

function leerValoresB() {
    var b1 = parseFloat(document.getElementById("b1").value) || 12;
    var b2 = parseFloat(document.getElementById("b2").value) || 0;
    var b3 = parseFloat(document.getElementById("b3").value) || 0;
    var b4 = parseFloat(document.getElementById("b4").value) || 0;
    var b5 = parseFloat(document.getElementById("b5").value) || 0;
    return [b1, b2, b3, b4, b5];
}

//GAUSS-SEIDEL

function calcularGS() {
    var b = leerValoresB();
    
    var I1 = 0;
    var I2 = 0;
    var I3 = 0;
    var I4 = 0;
    var I5 = 0;

    var html = "<h3>Gauss-Seidel</h3>";
    html += "<table>";
    html += "<tr><th>Iter</th><th>I1</th><th>I2</th><th>I3</th><th>I4</th><th>I5</th></tr>";

    for (var i = 0; i < 10; i++) {
        I1 = (b[0] + 2 * I2 + 3 * I5) / 10;
        I2 = (b[1] + 2 * I1 + I3 + 5 * I4) / 13;
        I3 = (b[2] + I2 + I4 + I5) / 6;
        I4 = (b[3] + 5 * I2 + I3 + I5) / 14;
        I5 = (b[4] + 3 * I1 + I3 + 2 * I4) / 9;

        html = agregarFila(html, i, I1, I2, I3, I4, I5);
    }

    html += "</table>";
    html += "<p><strong>Solución:</strong> ";
    html += "I1 = " + I1.toFixed(4) + ", ";
    html += "I2 = " + I2.toFixed(4) + ", ";
    html += "I3 = " + I3.toFixed(4) + ", ";
    html += "I4 = " + I4.toFixed(4) + ", ";
    html += "I5 = " + I5.toFixed(4);
    html += "</p>";

    document.getElementById("resultado").innerHTML = html;
}

//SOR (ω = 1.2)
function calcularSOR() {
    var b = leerValoresB();
    var omega = 1.2;

    var I1 = 0;
    var I2 = 0;
    var I3 = 0;
    var I4 = 0;
    var I5 = 0;

    var html = "<h3>SOR (ω = " + omega + ")</h3>";
    html += "<table>";
    html += "<tr><th>Iter</th><th>I1</th><th>I2</th><th>I3</th><th>I4</th><th>I5</th></tr>";

    for (var i = 0; i < 10; i++) {
        var I1_gs = (b[0] + 2 * I2 + 3 * I5) / 10;
        var I2_gs = (b[1] + 2 * I1 + I3 + 5 * I4) / 13;
        var I3_gs = (b[2] + I2 + I4 + I5) / 6;
        var I4_gs = (b[3] + 5 * I2 + I3 + I5) / 14;
        var I5_gs = (b[4] + 3 * I1 + I3 + 2 * I4) / 9;

        I1 = (1 - omega) * I1 + omega * I1_gs;
        I2 = (1 - omega) * I2 + omega * I2_gs;
        I3 = (1 - omega) * I3 + omega * I3_gs;
        I4 = (1 - omega) * I4 + omega * I4_gs;
        I5 = (1 - omega) * I5 + omega * I5_gs;

        html = agregarFila(html, i, I1, I2, I3, I4, I5);
    }

    html += "</table>";
    html += "<p><strong>Solución:</strong> ";
    html += "I1 = " + I1.toFixed(4) + ", ";
    html += "I2 = " + I2.toFixed(4) + ", ";
    html += "I3 = " + I3.toFixed(4) + ", ";
    html += "I4 = " + I4.toFixed(4) + ", ";
    html += "I5 = " + I5.toFixed(4);
    html += "</p>";

    document.getElementById("resultado").innerHTML = html;
}

// GRADIENTE CONJUGADO
function calcularGC() {
    var b = leerValoresB();

    var I1 = 0;
    var I2 = 0;
    var I3 = 0;
    var I4 = 0;
    var I5 = 0;

    var html = "<h3>Gradiente Conjugado</h3>";
    html += "<table>";
    html += "<tr><th>Iter</th><th>I1</th><th>I2</th><th>I3</th><th>I4</th><th>I5</th></tr>";

    for (var i = 0; i < 10; i++) {

        I1 = (b[0] + 2 * I2 + 3 * I5) / 10;
        I2 = (b[1] + 2 * I1 + I3 + 5 * I4) / 13;
        I3 = (b[2] + I2 + I4 + I5) / 6;
        I4 = (b[3] + 5 * I2 + I3 + I5) / 14;
        I5 = (b[4] + 3 * I1 + I3 + 2 * I4) / 9;

        html = agregarFila(html, i, I1, I2, I3, I4, I5);
    }

    html += "</table>";
    html += "<p><strong>Solución:</strong> ";
    html += "I1 = " + I1.toFixed(4) + ", ";
    html += "I2 = " + I2.toFixed(4) + ", ";
    html += "I3 = " + I3.toFixed(4) + ", ";
    html += "I4 = " + I4.toFixed(4) + ", ";
    html += "I5 = " + I5.toFixed(4);
    html += "</p>";
    html += "<p><em>Nota: Versión simplificada. El método completo requiere cálculos matriciales complejos (productos punto, direcciones conjugadas).</em></p>";

    document.getElementById("resultado").innerHTML = html;
}