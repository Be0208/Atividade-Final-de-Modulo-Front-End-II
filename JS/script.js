const characterList = document.getElementById('character-list');
const paginationContainer = document.getElementById('pagination');
const apiUrl = 'https://rickandmortyapi.com/api/character';

async function getCharacters(page = 1) {
    const response = await fetch(`${apiUrl}?page=${page}`);
    const data = await response.json();
    return data;
}

function getStatusClass(status) {
    switch (status.toLowerCase()) {
        case 'alive':
            return 'status-alive';
        case 'dead':
            return 'status-dead';
        default:
            return 'status-unknown';
    }
}

function displayCharacters(characters) {
    characterList.innerHTML = '';

    characters.results.forEach(character => {
        const characterCard = document.createElement('div');
        characterCard.classList.add('character-card');

        const statusClass = getStatusClass(character.status);

        characterCard.innerHTML = `
            <img src="${character.image}" alt="${character.name}">
            <h3>${character.name}</h3>
            <div class="status ${statusClass}"></div>
            <p>Species: ${character.species}</p>
        `;

        characterList.appendChild(characterCard);
    });
}

function displayPagination(info) {
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= info.pages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => fetchAndDisplayCharacters(i));

        paginationContainer.appendChild(pageButton);
    }
}

async function fetchAndDisplayCharacters(page) {
    const charactersData = await getCharacters(page);

    displayCharacters(charactersData);
    displayPagination(charactersData.info);
    fetchApiInfo();
}

const searchInput = document.getElementById('search-input');

async function searchCharacters() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm === '') {
        fetchAndDisplayCharacters(1);
    } else {
        const response = await fetch(`${apiUrl}?name=${searchTerm}`);
        const searchData = await response.json();
        displayCharacters(searchData);
        // Se desejar, você pode adicionar uma paginação para os resultados da pesquisa.
    }
}

async function fetchApiInfo() {
    const charactersResponse = await fetch('https://rickandmortyapi.com/api/character');
    const charactersData = await charactersResponse.json();

    const locationsResponse = await fetch('https://rickandmortyapi.com/api/location');
    const locationsData = await locationsResponse.json();

    const episodesResponse = await fetch('https://rickandmortyapi.com/api/episode');
    const episodesData = await episodesResponse.json();

    const apiInfoContainer = document.getElementById('api-info');
    apiInfoContainer.innerHTML = `
        <p>Total de Personagens: ${charactersData.info.count}</p>
        <p>Total de Localizações: ${locationsData.info.count}</p>
        <p>Total de Episódios: ${episodesData.info.count}</p>
    `;
}

// Carregar personagens da primeira página ao carregar a página
fetchAndDisplayCharacters(1);
