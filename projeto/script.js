// Dados em memória
let livros = [];

// Elementos do DOM
const formLivro = document.getElementById('livro-form');
const tituloInput = document.getElementById('titulo');
const autorInput = document.getElementById('autor');
const anoInput = document.getElementById('ano');
const generoSelect = document.getElementById('genero');
const lidoCheckbox = document.getElementById('lido');
const tituloError = document.getElementById('titulo-error');
const autorError = document.getElementById('autor-error');
const livrosGrid = document.getElementById('livros-grid');
const semLivrosMsg = document.getElementById('sem-livros');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const filtrarGeneroSelect = document.getElementById('filtrar-genero');
const filtrarLidosSelect = document.getElementById('filtrar-lidos');
const totalLivrosElement = document.getElementById('total-livros');
const livrosLidosElement = document.getElementById('livros-lidos');
const generosStatsElement = document.getElementById('generos-stats');
const outroGeneroContainer = document.getElementById('outro-genero-container');
const outroGeneroInput = document.getElementById('outro-genero');


// Navegação entre seções
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');
        
        // Atualiza links de navegação
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        link.classList.add('active');
        
        // Atualiza seções visíveis
        sections.forEach(section => section.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');
        
        // Se for o catálogo ou estatísticas, atualiza a exibição
        if (sectionId === 'catalogo') {
            renderizarLivros();
        } else if (sectionId === 'estatisticas') {
            atualizarEstatisticas();
        }
    });
});

// Validação do formulário
tituloInput.addEventListener('input', validarTitulo);
autorInput.addEventListener('input', validarAutor);

function validarTitulo() {
    if (tituloInput.value.trim().length < 3) {
        tituloError.textContent = 'O título deve ter pelo menos 3 caracteres';
        tituloError.style.display = 'block';
        return false;
    } else {
        tituloError.style.display = 'none';
        return true;
    }
}

function validarAutor() {
    if (autorInput.value.trim().length === 0) {
        autorError.textContent = 'O autor é obrigatório';
        autorError.style.display = 'block';
        return false;
    } else {
        autorError.style.display = 'none';
        return true;
    }
}

// Submissão do formulário
formLivro.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validação
    const isTituloValido = validarTitulo();
    const isAutorValido = validarAutor();
    
    if (!isTituloValido || !isAutorValido) return;
    
    // Cria novo livro
    const novoLivro = {
        id: Date.now(),
        titulo: tituloInput.value.trim(),
        autor: autorInput.value.trim(),
        ano: anoInput.value ? parseInt(anoInput.value) : null,
        genero: generoSelect.value,
        lido: lidoCheckbox.checked,
        dataAdicao: new Date()
    };
    
    // Adiciona ao array
    livros.push(novoLivro);
    
    // Limpa o formulário
    formLivro.reset();
    
    // Feedback
    alert('Livro adicionado ao catálogo com sucesso!');
    
    // Atualiza as seções relevantes
    if (document.getElementById('catalogo').classList.contains('active')) {
        renderizarLivros();
    } else if (document.getElementById('estatisticas').classList.contains('active')) {
        atualizarEstatisticas();
    }
});

// Filtros
filtrarGeneroSelect.addEventListener('change', renderizarLivros);
filtrarLidosSelect.addEventListener('change', renderizarLivros);

// Renderiza a lista de livros
function renderizarLivros() {
    const generoFiltro = filtrarGeneroSelect.value;
    const lidoFiltro = filtrarLidosSelect.value;
    
    // Filtra os livros
    let livrosFiltrados = livros.filter(livro => {
        const generoMatch = generoFiltro === 'todos' || livro.genero === generoFiltro;
        const lidoMatch = 
            lidoFiltro === 'todos' || 
            (lidoFiltro === 'lidos' && livro.lido) || 
            (lidoFiltro === 'nao-lidos' && !livro.lido);
        
        return generoMatch && lidoMatch;
    });
    
    // Atualiza a exibição
    if (livrosFiltrados.length === 0) {
        semLivrosMsg.style.display = 'block';
        livrosGrid.style.display = 'none';
        return;
    }
    
    semLivrosMsg.style.display = 'none';
    livrosGrid.style.display = 'grid';
    livrosGrid.innerHTML = '';
    
    livrosFiltrados.forEach(livro => {
        const livroCard = document.createElement('div');
        livroCard.className = 'livro-card';
        livroCard.innerHTML = `
            <div class="livro-header">
                <h3>${livro.titulo}</h3>
                <p>${livro.autor}</p>
            </div>
            <div class="livro-body">
                ${livro.ano ? `<p><strong>Ano:</strong> ${livro.ano}</p>` : ''}
                <span class="genero-tag">${formatarGenero(livro.genero)}</span>
            </div>
            <div class="livro-footer">
                ${livro.lido ? '<span class="lido-badge">LIDO</span>' : ''}
                <button class="remover-btn" data-id="${livro.id}">×</button>
            </div>
        `;
        livrosGrid.appendChild(livroCard);
    });
    
    // Adiciona eventos aos botões de remover
    document.querySelectorAll('.remover-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.getAttribute('data-id'));
            removerLivro(id);
        });
    });
}

// Formata o gênero para exibição
function formatarGenero(genero) {
    const generos = {
        'ficcao': 'Ficção',
        'fantasia': 'Fantasia',
        'scifi': 'Ficção Científica',
        'romance': 'Romance',
        'misterio': 'Mistério',
        'tecnico': 'Técnico',
        'biografia': 'Biografia',
        'outro': 'Outro'
    };
    
    // Se não estiver no mapeamento, retorna o próprio valor capitalizado
    return generos[genero] || (genero.charAt(0).toUpperCase() + genero.slice(1));
}

formLivro.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validação
    const isTituloValido = validarTitulo();
    const isAutorValido = validarAutor();
    
    if (!isTituloValido || !isAutorValido) return;
    
    // Determina o gênero
    let genero = generoSelect.value;
    if (genero === 'outro' && outroGeneroInput.value.trim()) {
        genero = outroGeneroInput.value.trim().toLowerCase();
    }
    
    // Cria novo livro
    const novoLivro = {
        id: Date.now(),
        titulo: tituloInput.value.trim(),
        autor: autorInput.value.trim(),
        ano: anoInput.value ? parseInt(anoInput.value) : null,
        genero: genero,
        lido: lidoCheckbox.checked,
        dataAdicao: new Date()
    };
    
    // Adiciona ao array
    livros.push(novoLivro);
    
    // Limpa o formulário
    formLivro.reset();
    outroGeneroContainer.style.display = 'none';
    
    // Feedback e atualizações
    alert('Livro adicionado ao catálogo com sucesso!');
    
    if (document.getElementById('catalogo').classList.contains('active')) {
        renderizarLivros();
    } else if (document.getElementById('estatisticas').classList.contains('active')) {
        atualizarEstatisticas();
    }
});

// Remove um livro
function removerLivro(id) {
    if (confirm('Tem certeza que deseja remover este livro do catálogo?')) {
        livros = livros.filter(livro => livro.id !== id);
        
        // Atualiza as seções relevantes
        if (document.getElementById('catalogo').classList.contains('active')) {
            renderizarLivros();
        }
        if (document.getElementById('estatisticas').classList.contains('active')) {
            atualizarEstatisticas();
        }
    }
}

// Atualiza as estatísticas
function atualizarEstatisticas() {
    // Total de livros
    totalLivrosElement.textContent = livros.length;
    
    // Livros lidos
    const livrosLidos = livros.filter(livro => livro.lido).length;
    livrosLidosElement.textContent = `${livrosLidos} (${livros.length > 0 ? Math.round((livrosLidos / livros.length) * 100) : 0}%)`;
    
    // Contagem por gênero
    const generosCount = {};
    livros.forEach(livro => {
        generosCount[livro.genero] = (generosCount[livro.genero] || 0) + 1;
    });
    
    generosStatsElement.innerHTML = '';
    for (const genero in generosCount) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${formatarGenero(genero)}:</span>
            <span>${generosCount[genero]} (${Math.round((generosCount[genero] / livros.length) * 100)}%)</span>
        `;
        generosStatsElement.appendChild(li);
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Exibe a seção de adicionar por padrão
    document.getElementById('adicionar').classList.add('active');
    
    // Carrega dados de exemplo (opcional)
    // livros = [...];
    // renderizarLivros();
    // atualizarEstatisticas();
});

generoSelect.addEventListener('change', function() {
    if (this.value === 'outro') {
        outroGeneroContainer.style.display = 'block';
        outroGeneroInput.setAttribute('required', '');
    } else {
        outroGeneroContainer.style.display = 'none';
        outroGeneroInput.removeAttribute('required');
    }
});

// Modifique a função de submissão do formulário para incluir o gênero personalizado
