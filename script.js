// Variáveis globais
let currentInitiative = '';
let analysisData = {};

// Controlar campos de oportunidade
function toggleOpportunityFields() {
    const objetivoTipo = document.getElementById('objetivo-tipo').value;
    const experienciaQuestion = document.getElementById('experiencia-question');
    const financialInputs = document.getElementById('financial-inputs');
    const experienceInputs = document.getElementById('experience-inputs');
    
    // Resetar campos
    document.getElementById('experiencia-com-dados').classList.add('hidden');
    document.getElementById('experiencia-sem-dados').classList.add('hidden');
    financialInputs.classList.add('hidden');
    experienceInputs.classList.add('hidden');
    
    if (objetivoTipo === 'experiencia') {
        experienciaQuestion.classList.remove('hidden');
        // Resetar radio buttons
        document.querySelectorAll('input[name="tem-dados"]').forEach(radio => {
            radio.checked = false;
        });
    } else {
        experienciaQuestion.classList.add('hidden');
        financialInputs.classList.remove('hidden');
    }
}

// Controlar campos financeiros baseado na resposta
function toggleFinancialFields() {
    const temDados = document.querySelector('input[name="tem-dados"]:checked');
    const experienceWithDataInputs = document.getElementById('experience-with-data-inputs');
    const experienciaSemDados = document.getElementById('experiencia-sem-dados');
    
    if (temDados) {
        if (temDados.value === 'sim') {
            experienceWithDataInputs.classList.remove('hidden');
            experienciaSemDados.classList.add('hidden');
        } else {
            experienceWithDataInputs.classList.add('hidden');
            experienciaSemDados.classList.remove('hidden');
        }
    }
}

// Inicializar campos ao carregar
document.addEventListener('DOMContentLoaded', function() {
    toggleOpportunityFields();
});
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateSliderValues();
});

function setupEventListeners() {
    // Botão iniciar análise
    document.getElementById('start-analysis').addEventListener('click', startAnalysis);
    
    // Enter no campo de nome
    document.getElementById('initiative-name').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            startAnalysis();
        }
    });

    // Sliders
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
        slider.addEventListener('input', function() {
            updateSliderValue(this.id);
        });
    });

    // Select de objetivo
    document.getElementById('objetivo-tipo').addEventListener('change', toggleOpportunityInputs);
    
    // Inicializar campos de oportunidade
    toggleOpportunityInputs();
}

function updateSliderValues() {
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
        updateSliderValue(slider.id);
    });
}

function updateSliderValue(sliderId) {
    const slider = document.getElementById(sliderId);
    const valueSpan = document.getElementById(sliderId + '-value');
    if (valueSpan) {
        valueSpan.textContent = slider.value;
    }
}

function startAnalysis() {
    const initiativeName = document.getElementById('initiative-name').value.trim();
    if (!initiativeName) {
        alert('Por favor, digite o nome da iniciativa.');
        return;
    }
    
    currentInitiative = initiativeName;
    document.getElementById('current-initiative').textContent = `Análise: ${initiativeName}`;
    
    // Transição para tela de preenchimento
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('input-screen').classList.remove('hidden');
}

function toggleOpportunityInputs() {
    const objetivoTipo = document.getElementById('objetivo-tipo').value;
    const financialInputs = document.getElementById('financial-inputs');
    const experienceInputs = document.getElementById('experience-inputs');
    
    if (objetivoTipo === 'financeiro') {
        financialInputs.classList.remove('hidden');
        experienceInputs.classList.add('hidden');
    } else {
        financialInputs.classList.add('hidden');
        experienceInputs.classList.remove('hidden');
    }
}

function nextSection(sectionId) {
    // Esconder seção atual
    const currentSection = document.querySelector('.section-card:not(.hidden)');
    if (currentSection) {
        currentSection.classList.add('hidden');
    }
    
    // Mostrar próxima seção
    document.getElementById(`section-${sectionId}`).classList.remove('hidden');
    
    // Atualizar indicador de progresso
    updateProgressIndicator(sectionId);
}

function prevSection(sectionId) {
    // Esconder seção atual
    const currentSection = document.querySelector('.section-card:not(.hidden)');
    if (currentSection) {
        currentSection.classList.add('hidden');
    }
    
    // Mostrar seção anterior
    document.getElementById(`section-${sectionId}`).classList.remove('hidden');
    
    // Atualizar indicador de progresso
    updateProgressIndicator(sectionId);
}

function updateProgressIndicator(activeStep) {
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach(step => {
        step.classList.remove('active');
        if (step.dataset.step === activeStep) {
            step.classList.add('active');
        }
    });
}

function generateResults() {
    // Coletar todos os dados
    collectData();
    
    // Calcular scores
    calculateScores();
    
    // Mostrar tela de resultados
    document.getElementById('input-screen').classList.add('hidden');
    document.getElementById('results-screen').classList.remove('hidden');
    
    // Atualizar indicador de progresso
    updateProgressIndicator('results');
    
    // Atualizar interface com resultados
    updateResultsInterface();
    
    // Desenhar gráfico radar
    drawRadarChart();
}

function collectData() {
    const objetivoTipo = document.getElementById('objetivo-tipo').value;
    const temDados = document.querySelector('input[name="tem-dados"]:checked');
    
    analysisData = {
        initiative: currentInitiative,
        
        // Seção V
        impactoCliente: parseInt(document.getElementById('impacto-cliente').value),
        impactoNegocio: parseInt(document.getElementById('impacto-negocio').value),
        alinhamentoEstrategico: parseInt(document.getElementById('alinhamento-estrategico').value),
        potencialReuso: parseInt(document.getElementById('potencial-reuso').value),
        
        // Seção A
        esforcoPontos: parseInt(document.getElementById('esforco-pontos').value) || 0,
        valorStoryPoint: parseFloat(document.getElementById('valor-story-point').value) || 0,
        custoAdicional: parseFloat(document.getElementById('custo-adicional').value) || 0,
        
        // Seção L - Lógica condicional
        objetivoTipo: objetivoTipo,
        temDadosFinanceiros: temDados ? temDados.value === 'sim' : false,
        
        // Seção E
        dependenciasExternas: parseInt(document.getElementById('dependencias-externas').value),
        integracoesSistemicas: parseInt(document.getElementById('integracoes-sistemicas').value),
        fatorUrgencia: document.getElementById('fator-urgencia').value
    };
    
    // Coletar dados específicos baseado no tipo e disponibilidade de dados
    if (objetivoTipo === 'financeiro') {
        analysisData.clientesImpactados = parseInt(document.getElementById('clientes-impactados').value) || 0;
        analysisData.ticketMedio = parseFloat(document.getElementById('ticket-medio').value) || 0;
        analysisData.taxaAdocao = parseFloat(document.getElementById('taxa-adocao').value) || 0;
    } else if (objetivoTipo === 'experiencia') {
        if (temDados && temDados.value === 'sim') {
            // Experiência COM dados financeiros
            analysisData.valorEstimado = parseFloat(document.getElementById('valor-estimado').value) || 0;
        } else {
            // Experiência SEM dados financeiros - análise qualitativa
            analysisData.valorEstimado = 0;
        }
    }
}

function calculateScores() {
    // Score V (40%) - Média simples dos 4 critérios
    const scoreV = (analysisData.impactoCliente + analysisData.impactoNegocio + 
                   analysisData.alinhamentoEstrategico + analysisData.potencialReuso) / 4;
    
    // Investimento total = (pontos × valor do ponto) + custo adicional
    const investimentoTotal = (analysisData.esforcoPontos * analysisData.valorStoryPoint) + analysisData.custoAdicional;
    
    // Score A (30%) - Baseado no valor do investimento
    let scoreA = 5;
    if (investimentoTotal > 1000000) scoreA = 1;
    else if (investimentoTotal > 500000) scoreA = 2;
    else if (investimentoTotal > 300000) scoreA = 3;
    else if (investimentoTotal > 100000) scoreA = 4;
    
    // Score E (30%) - Média das dependências e integrações
    const scoreE = (analysisData.dependenciasExternas + analysisData.integracoesSistemicas) / 2;
    
    // Calcular valor da oportunidade e Score L
    let valorOportunidade = 0;
    let scoreL = 1;
    let isQualitativeAnalysis = false;
    
    if (analysisData.objetivoTipo === 'financeiro') {
        // Para financeiro: cálculo padrão
        valorOportunidade = analysisData.clientesImpactados * analysisData.ticketMedio * (analysisData.taxaAdocao / 100);
        const roiRatio = investimentoTotal > 0 ? (valorOportunidade / investimentoTotal) : 0;
        if (roiRatio >= 5) scoreL = 5;
        else if (roiRatio >= 3) scoreL = 4;
        else if (roiRatio >= 2) scoreL = 3;
        else if (roiRatio >= 1.5) scoreL = 2;
    } else if (analysisData.objetivoTipo === 'experiencia') {
        if (analysisData.temDadosFinanceiros) {
            // Experiência COM dados financeiros
            valorOportunidade = analysisData.valorEstimado;
            const roiRatio = investimentoTotal > 0 ? (valorOportunidade / investimentoTotal) : 0;
            if (roiRatio >= 5) scoreL = 5;
            else if (roiRatio >= 3) scoreL = 4;
            else if (roiRatio >= 2) scoreL = 3;
            else if (roiRatio >= 1.5) scoreL = 2;
        } else {
            // Experiência SEM dados financeiros - análise qualitativa
            isQualitativeAnalysis = true;
            valorOportunidade = 0;
            scoreL = 0; // Não considera L no score final
        }
    }
    
    // Score VALE final - Ajustado para análise qualitativa
    let scoreVALE;
    if (isQualitativeAnalysis) {
        // Para análise qualitativa: apenas V, A, E (sem L)
        scoreVALE = (scoreV * 0.5) + (scoreA * 0.3) + (scoreE * 0.2);
    } else {
        // Para análise quantitativa: V, A, L, E
        scoreVALE = (scoreV * 0.4) + (scoreA * 0.3) + (scoreL * 0.15) + (scoreE * 0.15);
    }
    
    // Calcular métricas financeiras
    const roi = investimentoTotal > 0 && valorOportunidade > 0 ? 
                ((valorOportunidade - investimentoTotal) / investimentoTotal) * 100 : 0;
    
    const retornoMensal = valorOportunidade / 12;
    const payback = retornoMensal > 0 ? (investimentoTotal / retornoMensal) : 0;
    
    const tir = calculateTIR(investimentoTotal, valorOportunidade);
    
    // Obter recomendação (já inclui tratamento de urgência)
    const recomendacao = getRecommendation(scoreVALE, roi, isQualitativeAnalysis);
    
    // Salvar resultados
    analysisData.results = {
        scoreV: scoreV,
        scoreA: scoreA,
        scoreL: scoreL,
        scoreE: scoreE,
        scoreVALE: scoreVALE,
        investimentoTotal: investimentoTotal,
        valorOportunidade: valorOportunidade,
        roi: roi,
        tir: tir,
        payback: payback,
        recomendacao: recomendacao,
        isQualitativeAnalysis: isQualitativeAnalysis
    };
}

function calculateTIR(investimento, valorOportunidade) {
    // TIR (Taxa Interna de Retorno) - Cálculo corrigido
    if (investimento <= 0 || valorOportunidade <= 0) return 0;
    
    // Para projetos com retorno em 1 ano:
    // TIR simples = (Valor Final / Valor Inicial) - 1
    const tirSimples = (valorOportunidade / investimento) - 1;
    
    // Converter para percentual
    const tir = tirSimples * 100;
    
    // Limitar TIR a valores razoáveis (máximo 100%, mínimo -50%)
    return Math.min(100, Math.max(-50, tir));
}

function getRecommendation(score, roi, isQualitative = false) {
    // Verificar se é um projeto especial (regulatório, estratégico ou contratual)
    const fatorUrgencia = analysisData.fatorUrgencia;
    
    // Para projetos especiais, retornar mensagem específica
    if (fatorUrgencia === 'regulatorio') {
        return {
            icon: '⚖️',
            text: 'PROJETO REGULATÓRIO - Execute independente do score para compliance',
            class: 'urgent'
        };
    }
    
    if (fatorUrgencia === 'ptc') {
        return {
            icon: '🎯',
            text: 'PROGRAMA ESTRATÉGICO - Prioridade alta para estabilidade e crescimento',
            class: 'urgent'
        };
    }
    
    // Para projetos contratuais (assumindo que seria uma nova opção)
    if (fatorUrgencia === 'contratual') {
        return {
            icon: '📋',
            text: 'COMPROMISSO CONTRATUAL - Execute para cumprir obrigações',
            class: 'urgent'
        };
    }
    
    // Para projetos normais, usar mensagens baseadas no score
    if (isQualitative) {
        // Para análise qualitativa, baseado apenas no score
        if (score >= 4.0) {
            return {
                icon: '✅',
                text: 'APROVADO - Projeto aprovado de cara para seguir para planejamento de portfólio',
                class: 'approved'
            };
        } else if (score >= 3.0) {
            return {
                icon: '💼',
                text: 'AVALIAR - Tem que ter agenda com time financeiro para análise detalhada',
                class: 'evaluate'
            };
        } else if (score >= 2.0) {
            return {
                icon: '🔄',
                text: 'REVISITAR - Tem que revisitar para melhorar antes de prosseguir',
                class: 'revisit'
            };
        } else {
            return {
                icon: '❌',
                text: 'NÃO RECOMENDADO - Score muito baixo, não vale a pena seguir',
                class: 'rejected'
            };
        }
    } else {
        // Para análise quantitativa, considera score e ROI
        if (score >= 4.0) {
            return {
                icon: '✅',
                text: 'APROVADO - Projeto aprovado de cara para seguir para planejamento de portfólio',
                class: 'approved'
            };
        } else if (score >= 3.0) {
            return {
                icon: '💼',
                text: 'AVALIAR - Tem que ter agenda com time financeiro para análise detalhada',
                class: 'evaluate'
            };
        } else if (score >= 2.0) {
            return {
                icon: '🔄',
                text: 'REVISITAR - Tem que revisitar para melhorar antes de prosseguir',
                class: 'revisit'
            };
        } else {
            return {
                icon: '❌',
                text: 'NÃO RECOMENDADO - Score muito baixo, não vale a pena seguir',
                class: 'rejected'
            };
        }
    }
}

function applyUrgencyFactor(recomendacao, fator) {
    const urgencyMessages = {
        'regulatorio': 'URGÊNCIA REGULATÓRIA - Execute independente do score',
        'ptc': 'Programa Estratégico (ex: PTC) - Prioridade alta para estabilidade',
        'competitivo': 'VANTAGEM COMPETITIVA - Considere timing de mercado',
        'sazonalidade': 'TIMING CRÍTICO - Avalie janela de oportunidade'
    };
    
    return {
        icon: '🔥',
        text: urgencyMessages[fator],
        class: 'urgent'
    };
}

function updateResultsInterface() {
    const results = analysisData.results;
    
    // Nome da iniciativa
    document.getElementById('results-initiative-name').textContent = `Resultados: ${analysisData.initiative}`;
    
    // Scores - Agora mostrando V A L E completo
    document.getElementById('score-vale').textContent = results.scoreVALE.toFixed(1);
    document.getElementById('score-v').textContent = results.scoreV.toFixed(1);
    document.getElementById('score-a').textContent = results.scoreA.toFixed(1);
    document.getElementById('score-l').textContent = results.scoreL.toFixed(1);
    document.getElementById('score-e').textContent = results.scoreE.toFixed(1);
    
    // Recomendação
    document.getElementById('recommendation-icon').textContent = results.recomendacao.icon;
    document.getElementById('recommendation-text').textContent = results.recomendacao.text;
    document.querySelector('.recommendation-card').className = `recommendation-card ${results.recomendacao.class}`;
    
    // Métricas financeiras
    document.getElementById('investimento-total').textContent = formatCurrency(results.investimentoTotal);
    document.getElementById('valor-oportunidade').textContent = formatCurrency(results.valorOportunidade);
    document.getElementById('roi-value').textContent = results.roi.toFixed(1) + '%';
    document.getElementById('tir-value').textContent = results.tir.toFixed(1) + '%';
    document.getElementById('payback-value').textContent = results.payback.toFixed(1) + ' meses';
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function drawRadarChart() {
    const canvas = document.getElementById('radar-chart');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;
    
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dados para o gráfico
    const data = [
        { label: 'Impacto Cliente', value: analysisData.impactoCliente },
        { label: 'Impacto Negócio', value: analysisData.impactoNegocio },
        { label: 'Alinhamento', value: analysisData.alinhamentoEstrategico },
        { label: 'Reuso', value: analysisData.potencialReuso },
        { label: 'Dependências', value: analysisData.dependenciasExternas },
        { label: 'Integrações', value: analysisData.integracoesSistemicas }
    ];
    
    // Desenhar grade
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI);
        ctx.stroke();
    }
    
    // Desenhar linhas dos eixos
    const angleStep = (2 * Math.PI) / data.length;
    for (let i = 0; i < data.length; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // Labels
        ctx.fillStyle = '#333';
        ctx.font = '12px Montserrat';
        ctx.textAlign = 'center';
        const labelX = centerX + Math.cos(angle) * (radius + 20);
        const labelY = centerY + Math.sin(angle) * (radius + 20);
        ctx.fillText(data[i].label, labelX, labelY);
    }
    
    // Desenhar dados
    ctx.strokeStyle = '#FFD700';
    ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i < data.length; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const value = (data[i].value / 5) * radius;
        const x = centerX + Math.cos(angle) * value;
        const y = centerY + Math.sin(angle) * value;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Desenhar pontos
    ctx.fillStyle = '#FFD700';
    for (let i = 0; i < data.length; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const value = (data[i].value / 5) * radius;
        const x = centerX + Math.cos(angle) * value;
        const y = centerY + Math.sin(angle) * value;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function goBackToEdit() {
    // Voltar para a tela de preenchimento mantendo os dados
    document.getElementById('results-screen').classList.add('hidden');
    document.getElementById('input-screen').classList.remove('hidden');
    
    // Voltar para a última seção (E) ao invés da primeira (V)
    document.querySelectorAll('.section-card').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById('section-e').classList.remove('hidden');
    
    // Atualizar indicador de progresso
    updateProgressIndicator('e');
}

function goBack() {
    // Resetar para tela inicial
    document.getElementById('results-screen').classList.add('hidden');
    document.getElementById('welcome-screen').classList.remove('hidden');
    
    // Limpar dados
    document.getElementById('initiative-name').value = '';
    currentInitiative = '';
    analysisData = {};
    
    // Resetar formulário
    resetForm();
}

function resetForm() {
    // Resetar sliders
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
        slider.value = 3;
        updateSliderValue(slider.id);
    });
    
    // Resetar inputs
    const inputs = document.querySelectorAll('input[type="number"], select');
    inputs.forEach(input => {
        if (input.type === 'number') {
            input.value = '';
        } else {
            input.selectedIndex = 0;
        }
    });
    
    // Resetar seções
    document.querySelectorAll('.section-card').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById('section-v').classList.remove('hidden');
    
    // Resetar progresso
    updateProgressIndicator('v');
    
    // Resetar campos de oportunidade
    toggleOpportunityInputs();
}

function exportToPDF() {
    try {
        // Verificar se jsPDF está disponível
        if (!window.jspdf) {
            alert('Erro: Biblioteca jsPDF não carregada. Tente recarregar a página.');
            return;
        }
        
        // Verificar se os dados da análise existem
        if (!analysisData || !analysisData.results) {
            alert('Erro: Dados da análise não encontrados. Execute a análise primeiro.');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
    
    // Configurações
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    let yPosition = margin;
    
    // Função auxiliar para adicionar texto
    function addText(text, fontSize = 12, isBold = false, color = [0, 0, 0]) {
        doc.setFontSize(fontSize);
        doc.setTextColor(color[0], color[1], color[2]);
        if (isBold) {
            doc.setFont(undefined, 'bold');
        } else {
            doc.setFont(undefined, 'normal');
        }
        doc.text(text, margin, yPosition);
        yPosition += fontSize * 0.5 + 5;
    }
    
    // Função para nova página
    function newPage() {
        doc.addPage();
        yPosition = margin;
    }
    
    // Função auxiliar para valores seguros
    function safeValue(value, defaultValue = 0) {
        return (value !== undefined && value !== null) ? value : defaultValue;
    }
    
    function safeText(value, defaultValue = 'N/A') {
        return (value !== undefined && value !== null) ? value : defaultValue;
    }
    
    // CAPA
    doc.setFillColor(255, 215, 0); // Amarelo NEXO
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    doc.setTextColor(44, 62, 80); // Cor escura
    doc.setFontSize(28);
    doc.setFont(undefined, 'bold');
    doc.text('RELATÓRIO DE ANÁLISE VALE', pageWidth/2, 35, { align: 'center' });
    
    yPosition = 80;
    addText(`Iniciativa: ${safeText(analysisData.initiative, 'Projeto sem nome')}`, 18, true);
    addText(`Data: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 12);
    addText('Uma iniciativa NEXO', 10, false, [127, 140, 141]);
    
    // Adicionar logo/mascote (simulado)
    yPosition = pageHeight - 60;
    addText('🐝 Gerado com a assistência da Melli', 10, false, [127, 140, 141]);
    
    newPage();
    
    // RESUMO EXECUTIVO
    addText('RESUMO EXECUTIVO', 20, true, [155, 89, 182]);
    yPosition += 10;
    
    addText(`Score VALE Final: ${safeValue(analysisData.results.scoreVALE, 0).toFixed(1)}/5.0`, 16, true);
    addText(`Recomendação: ${safeText(analysisData.results.recomendacao?.text, 'Não disponível')}`, 14, true);
    yPosition += 10;
    
    // Breakdown dos scores
    addText('Breakdown dos Scores:', 14, true);
    addText(`• Valor Proposto (V): ${safeValue(analysisData.results.scoreV, 0).toFixed(1)}/5.0`, 12);
    addText(`• Alocação Necessária (A): ${safeValue(analysisData.results.scoreA, 0).toFixed(1)}/5.0`, 12);
    addText(`• Lucro/Oportunidade (L): ${safeValue(analysisData.results.scoreL, 0).toFixed(1)}/5.0`, 12);
    addText(`• Execução Viável (E): ${safeValue(analysisData.results.scoreE, 0).toFixed(1)}/5.0`, 12);
    yPosition += 10;
    
    // Métricas Financeiras
    addText('MÉTRICAS FINANCEIRAS', 16, true, [155, 89, 182]);
    addText(`Investimento Total: ${formatCurrency(safeValue(analysisData.results.investimentoTotal, 0))}`, 12);
    addText(`Valor da Oportunidade: ${formatCurrency(safeValue(analysisData.results.valorOportunidade, 0))}`, 12);
    addText(`ROI: ${safeValue(analysisData.results.roi, 0).toFixed(1)}%`, 12);
    addText(`TIR: ${safeValue(analysisData.results.tir, 0).toFixed(1)}%`, 12);
    addText(`Payback: ${safeValue(analysisData.results.payback, 0).toFixed(1)} meses`, 12);
    
    newPage();
    
    // DETALHES DA ANÁLISE
    addText('DETALHES DA ANÁLISE', 20, true, [155, 89, 182]);
    yPosition += 10;
    
    addText('Seção V - Valor Proposto:', 14, true);
    addText(`• Impacto no Cliente: ${safeValue(analysisData.impactoCliente, 0)}/5`, 12);
    addText(`• Impacto no Negócio: ${safeValue(analysisData.impactoNegocio, 0)}/5`, 12);
    addText(`• Alinhamento Estratégico: ${safeValue(analysisData.alinhamentoEstrategico, 0)}/5`, 12);
    addText(`• Potencial de Reuso: ${safeValue(analysisData.potencialReuso, 0)}/5`, 12);
    yPosition += 5;
    
    addText('Seção A - Alocação Necessária:', 14, true);
    addText(`• Esforço do Time: ${safeValue(analysisData.esforcoPontos, 0)} pontos`, 12);
    addText(`• Valor do Story Point: ${formatCurrency(safeValue(analysisData.valorStoryPoint, 0))}`, 12);
    addText(`• Custo Adicional: ${formatCurrency(safeValue(analysisData.custoAdicional, 0))}`, 12);
    addText(`• Investimento Total: ${formatCurrency(safeValue(analysisData.results.investimentoTotal, 0))}`, 12);
    yPosition += 5;
    
    addText('Seção L - Lucro/Oportunidade:', 14, true);
    addText(`• Tipo de Objetivo: ${safeText(analysisData.objetivoTipo) === 'financeiro' ? 'Financeiro' : 'Experiência'}`, 12);
    addText(`• Clientes Impactados: ${safeValue(analysisData.clientesImpactados, 0).toLocaleString('pt-BR')}`, 12);
    if (safeText(analysisData.objetivoTipo) === 'financeiro') {
        addText(`• Valor Médio por Cliente: ${formatCurrency(safeValue(analysisData.ticketMedio, 0))}`, 12);
        addText(`• Taxa de Adoção: ${safeValue(analysisData.taxaAdocao, 0)}%`, 12);
    } else {
        addText(`• Valor Estimado: ${formatCurrency(safeValue(analysisData.valorEstimado, 0))}`, 12);
    }
    yPosition += 5;
    
    addText('Seção E - Execução Viável:', 14, true);
    addText(`• Dependências Externas: ${safeValue(analysisData.dependenciasExternas, 0)}/5`, 12);
    addText(`• Integrações Sistêmicas: ${safeValue(analysisData.integracoesSistemicas, 0)}/5`, 12);
    addText(`• Fator de Urgência: ${safeText(analysisData.fatorUrgencia, 'Nenhuma')}`, 12);
    
    // Rodapé
    doc.setFontSize(10);
    doc.setTextColor(127, 140, 141);
    doc.text('Gerado pela Plataforma Método VALE | Uma iniciativa NEXO', pageWidth/2, pageHeight - 10, { align: 'center' });
    
    // Salvar PDF
    const fileName = `Analise_VALE_${analysisData.initiative.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    // Mostrar mensagem de sucesso
    alert('Relatório PDF gerado com sucesso!');
    
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        alert('Erro ao gerar o relatório PDF. Verifique se todos os dados foram preenchidos corretamente.');
    }
}

// Tooltips
function showTooltip(type) {
    const tooltips = {
        'impacto-cliente': `<strong>Impacto no Cliente</strong><br><br>
        Avalia o quanto esta iniciativa impactará positivamente a experiência e satisfação dos clientes:<br><br>
        <strong>5 - Transformacional:</strong> Muda completamente a experiência do cliente, resolve dores críticas<br>
        <strong>4 - Alto:</strong> Melhoria significativa na experiência, reduz fricções importantes<br>
        <strong>3 - Moderado:</strong> Melhoria perceptível mas não crítica para o cliente<br>
        <strong>2 - Baixo:</strong> Pequena melhoria, pouco perceptível pelo cliente<br>
        <strong>1 - Mínimo:</strong> Impacto quase imperceptível na experiência do cliente`,
        
        'impacto-negocio': `<strong>Impacto no Negócio</strong><br><br>
        Mede o impacto direto nos resultados de negócio (receita, custos, eficiência, market share):<br><br>
        <strong>5 - Crítico:</strong> Impacto direto em KPIs principais, potencial de crescimento >20%<br>
        <strong>4 - Alto:</strong> Impacto significativo em métricas importantes, crescimento 10-20%<br>
        <strong>3 - Moderado:</strong> Impacto mensurável mas não crítico, crescimento 5-10%<br>
        <strong>2 - Baixo:</strong> Impacto pequeno e indireto, crescimento 1-5%<br>
        <strong>1 - Mínimo:</strong> Impacto quase imperceptível nos resultados de negócio`,
        
        'alinhamento-estrategico': `<strong>Alinhamento Estratégico</strong><br><br>
        Verifica o alinhamento com Must Win Battles, OKRs do ano e objetivos estratégicos da empresa:<br><br>
        <strong>5 - Total:</strong> Iniciativa é Must Win Battle ou OKR crítico, prioridade máxima da liderança<br>
        <strong>4 - Alto:</strong> Forte alinhamento com OKRs principais e estratégia corporativa<br>
        <strong>3 - Moderado:</strong> Alinhado com OKRs secundários mas não é Must Win Battle<br>
        <strong>2 - Baixo:</strong> Alinhamento parcial, pode competir com OKRs prioritários<br>
        <strong>1 - Mínimo:</strong> Pouco ou nenhum alinhamento com Must Win Battles e OKRs atuais`,
        
        'potencial-reuso': `<strong>Potencial de Reuso</strong><br><br>
        Avalia se componentes, aprendizados ou soluções podem ser reutilizados em outros projetos:<br><br>
        <strong>5 - Máximo:</strong> Solução reutilizável em múltiplos projetos, cria plataforma<br>
        <strong>4 - Alto:</strong> Componentes reutilizáveis em vários contextos similares<br>
        <strong>3 - Moderado:</strong> Alguns elementos podem ser reutilizados com adaptações<br>
        <strong>2 - Baixo:</strong> Pouco potencial de reuso, solução muito específica<br>
        <strong>1 - Mínimo:</strong> Solução única, sem potencial de reuso em outros projetos`,
        
        'dependencias-externas': `<strong>Dependências Externas</strong><br><br>
        Considera dependências de terceiros, fornecedores, parceiros ou outras áreas:<br><br>
        <strong>5 - Nenhuma:</strong> Projeto totalmente autônomo, sem dependências externas<br>
        <strong>4 - Mínimas:</strong> 1-2 dependências simples e controláveis<br>
        <strong>3 - Poucas:</strong> 3-4 dependências moderadas, risco controlável<br>
        <strong>2 - Algumas:</strong> 5-7 dependências, requer coordenação ativa<br>
        <strong>1 - Muitas:</strong> 8+ dependências críticas, alto risco de atrasos`,
        
        'integracoes-sistemicas': `<strong>Integrações Sistêmicas</strong><br><br>
        Avalia a complexidade técnica das integrações necessárias:<br><br>
        <strong>5 - Nenhuma:</strong> Sem necessidade de integrações sistêmicas<br>
        <strong>4 - Uma:</strong> Uma integração simples com sistema conhecido<br>
        <strong>3 - Duas:</strong> Duas integrações ou uma complexa<br>
        <strong>2 - Três:</strong> Três integrações ou múltiplas complexas<br>
        <strong>1 - Quatro+:</strong> Quatro ou mais integrações, alta complexidade técnica`
    };
    
    const tooltip = document.getElementById('tooltip');
    const tooltipText = document.getElementById('tooltip-text');
    
    tooltipText.innerHTML = tooltips[type] || 'Informação não disponível.';
    tooltip.classList.remove('hidden');
}

function hideTooltip() {
    document.getElementById('tooltip').classList.add('hidden');
}

// Fechar tooltip clicando fora
document.addEventListener('click', function(e) {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip.contains(e.target) && !e.target.classList.contains('info-icon')) {
        hideTooltip();
    }
});


// Funções para o sistema de ajuda
function openHelpModal() {
    document.getElementById('help-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeHelpModal() {
    document.getElementById('help-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function showHelpTab(tabName) {
    // Remover classe active de todas as abas
    document.querySelectorAll('.help-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remover classe active de todo o conteúdo
    document.querySelectorAll('.help-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Adicionar classe active na aba clicada
    event.target.classList.add('active');
    
    // Mostrar conteúdo correspondente
    document.getElementById('help-' + tabName).classList.add('active');
}

// Fechar modal ao clicar fora dele
document.addEventListener('click', function(event) {
    const modal = document.getElementById('help-modal');
    if (event.target === modal) {
        closeHelpModal();
    }
});

// Fechar modal com tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeHelpModal();
    }
});

