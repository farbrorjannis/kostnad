function beraknaPris() {
    // Hämta värden från input-fälten
    const material = parseFloat(document.getElementById('materialkostnad').value) || 0;
    const timmar = parseFloat(document.getElementById('timmar').value) || 0;
    
    // ÄNDRING: Hantera tomt timlönsfält
    const timlonInput = document.getElementById('timlon').value;
    const timlon = timlonInput === '' ? 0 : parseFloat(timlonInput) || 0;
    
    const provision = parseFloat(document.getElementById('provision').value) || 0;
    const omkostnader = parseFloat(document.getElementById('omkostnader').value) || 0;
    const vinstmarginal = parseFloat(document.getElementById('vinstmarginal').value) || 0;

    // Räkna ut minimipris (arbete + material + omkostnader)
    const arbetskostnad = timmar * timlon;
    let minimipris = material + arbetskostnad + omkostnader;

    // Om vinstmarginal anges, lägg till den
    if (vinstmarginal > 0) {
        minimipris = minimipris * (1 + vinstmarginal / 100);
    }

    // Räkna ut pris med hänsyn till galleriprovision
    let slutligtPris = minimipris;
    if (provision > 0 && provision < 100) {
        // Om galleriet tar X%, måste priset vara högre så att du får kvar minimipriset
        slutligtPris = minimipris / (1 - provision / 100);
    } else if (provision >= 100) {
        alert('Provision kan inte vara 100% eller mer!');
        return;
    }

    // Visa resultat med fin formatering
    const resultatDiv = document.getElementById('resultat');
    
    let resultatHtml = `
        <p>💰 <strong>Minimipris (din del):</strong> ${formatValuta(minimipris)}</p>
    `;
    
    if (provision > 0) {
        resultatHtml += `
            <p>🏛️ <strong>Pris med ${provision}% galleriprovision:</strong> ${formatValuta(slutligtPris)}</p>
            <p style="font-size: 1rem; color: #7f8c8d;">
                (Galleriet får ${formatValuta(slutligtPris * provision / 100)}, du får ${formatValuta(minimipris)})
            </p>
        `;
    } else {
        resultatHtml += `<p>🖼️ <strong>Ditt rekommenderade pris:</strong> ${formatValuta(slutligtPris)}</p>`;
    }
    
    // Visa detaljer (visa bara arbetskostnad om timlön är ifylld)
    resultatHtml += `
        <hr style="margin: 1rem 0; border: 1px dashed #e1e8ed;">
        <p style="font-size: 1rem;"><strong>Detaljer:</strong></p>
        <ul style="font-size: 1rem; list-style: none; padding-left: 0;">
            <li>🎨 Materialkostnad: ${formatValuta(material)}</li>
    `;
    
    // ÄNDRING: Visa bara arbetskostnad om timlön är ifylld
    if (timlon > 0) {
        resultatHtml += `<li>⏱️ Arbetskostnad (${timmar} h × ${formatValuta(timlon)}/h): ${formatValuta(arbetskostnad)}</li>`;
    }
    
    resultatHtml += `
            ${omkostnader > 0 ? `<li>📦 Omkostnader: ${formatValuta(omkostnader)}</li>` : ''}
            ${vinstmarginal > 0 ? `<li>📈 Vinstmarginal (${vinstmarginal}%): +${formatValuta((material + arbetskostnad + omkostnader) * vinstmarginal/100)}</li>` : ''}
        </ul>
    `;
    
    resultatDiv.innerHTML = resultatHtml;
}

function nollstall() {
    document.getElementById('materialkostnad').value = 0;
    document.getElementById('timmar').value = 0;
    document.getElementById('timlon').value = '';  // ÄNDRING: Tomt istället för 250
    document.getElementById('provision').value = 0;
    document.getElementById('omkostnader').value = 0;
    document.getElementById('vinstmarginal').value = 0;
    
    document.getElementById('resultat').innerHTML = 
        '<p>Fyll i värden ovan för att se prisförslag</p>';
}

function formatValuta(belopp) {
    return belopp.toFixed(0) + ' kr';
}

// Lägg till så att Enter-tangenten fungerar i fälten
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            beraknaPris();
        }
    });
});
