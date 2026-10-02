// Substitua pela URL do seu Web App do Google Apps Script
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwKiaNpbeYjKZ-VEuGFuVI0dSy9TMTRe_sGsqUdF7TElG5zSlpKc1L0u1TrL-RWiOTWww/exec";

async function finalizarAtividade() {
    const nome = document.getElementById('nome').value.trim();
    const chamada = document.getElementById('chamada').value.trim();
    const turma = document.getElementById('turma').value.trim();

    if (!nome || !chamada || !turma) {
        alert("Por favor, preencha todos os dados de identificação antes de finalizar.");
        document.getElementById('nome').focus();
        return;
    }

    const respostas = {};
    let todasRespondidas = true;

    for (let i = 1; i <= 10; i++) {
        const radios = document.getElementsByName(`q${i}`);
        let respondida = false;
        for (const radio of radios) {
            if (radio.checked) {
                respostas[`q${i}`] = radio.value;
                respondida = true;
                break;
            }
        }
        if (!respondida) {
            todasRespondidas = false;
        }
    }

    if (!todasRespondidas) {
        alert("Existem questões sem resposta. Por favor, responda todas as 10 questões.");
        return;
    }

    const dataHoraEnvio = new Date().toLocaleString('pt-BR');

    const dadosEnvio = {
        atividade: "Atividade 2", // <--- Adicionado para registrar na planilha
        nome: nome,
        chamada: chamada,
        turma: turma,
        dataHora: dataHoraEnvio,
        ...respostas
    };

    document.getElementById('loading').style.display = 'block';

    if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== "SUA_URL_DO_GOOGLE_APPS_SCRIPT_AQUI") {
        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosEnvio)
            });
        } catch (error) {
            console.error("Erro ao enviar para a planilha:", error);
        }
    }

    try {
        // Inicializa o jsPDF de forma compatível com UMD
        const doc = new window.jspdf.jsPDF();

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Comprovante de Atividade Complementar", 20, 20);
        
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text("Curso Técnico em Agropecuária - Módulo II", 20, 28);
        
        doc.setLineWidth(0.5);
        doc.line(20, 32, 190, 32);

        doc.setFont("helvetica", "bold");
        doc.text("Dados do Aluno:", 20, 42);
        doc.setFont("helvetica", "normal");
        doc.text(`Nome: ${nome}`, 20, 50);
        doc.text(`Nº da Chamada: ${chamada}`, 20, 57);
        doc.text(`Turma: ${turma}`, 20, 64);
        doc.text(`Data e Hora: ${dataHoraEnvio}`, 20, 71);

        doc.setFont("helvetica", "bold");
        doc.text("Respostas Assinaladas:", 20, 85);

        doc.setFont("helvetica", "normal");
        let y = 93;
        for (let i = 1; i <= 10; i++) {
            doc.text(`Questão ${i}: Alternativa [ ${respostas[`q${i}`]} ]`, 25, y);
            y += 7;
        }

        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text("Atividade concluída e registrada com sucesso no sistema acadêmico.", 20, 280);

        doc.save(`Atividade1_Agropecuaria_${nome.replace(/\s+/g, '_')}.pdf`);

    } catch (err) {
        console.error("Erro ao gerar PDF:", err);
        alert("Ocorreu um erro ao gerar o seu PDF: " + err.message);
    }

    document.getElementById('loading').style.display = 'none';
    alert("Parabéns! Sua atividade foi enviada com sucesso e o comprovante em PDF foi baixado em seu dispositivo.");
    
    window.location.href = "main.html";
}