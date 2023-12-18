const characterList = document.getElementById('character-list');
const paginationContainer = document.getElementById('pagination');

const apiUrl = 'https://rickandmortyapi.com/api/character';

async function getCharacters(page = 1) {
    const response = await fetch(`${apiUrl}?page=${page}`);
    const data = await response.json();

    // Adiciona informações do episódio associado a cada personagem
    const charactersWithEpisodes = await Promise.all(
        data.results.map(async character => {
            const episodeResponse = await fetch(character.episode[0]); // Assume que o personagem está associado ao primeiro episódio em seu array de episódios
            const episodeData = await episodeResponse.json();
            character.lastEpisode = episodeData.name; // Adiciona a propriedade lastEpisode ao personagem
            return character;
        })
    );

    return { ...data, results: charactersWithEpisodes };
}

function displayCharacters(characters) {
    characterList.innerHTML = '';

    characters.results.forEach(character => {
        const characterCard = document.createElement('div');
        characterCard.classList.add('character-card');

        characterCard.innerHTML = `
            <img src="${character.image}" class="character-image" alt="${character.name}">
            <div class="character-description">
                <p>${character.id}</p>
                <h2>${character.name}</h2>
                <div class="status">
                    <div class="status-indicator"></div>
                    <span>${character.status} - ${character.species}</span>
                </div>
                <p>Última localização conhecida: ${character.location.name}</p>
                <p>Visto pela última vez em: ${character.lastEpisode}</p>
            </div>
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
}

// Carregar personagens da primeira página ao carregar a página
fetchAndDisplayCharacters(1);

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


async function fetchAndDisplayCharacters(page) {
    const charactersData = await getCharacters(page);

    displayCharacters(charactersData);
    displayPagination(charactersData.info);
    fetchApiInfo(); // Atualiza as informações da API na parte inferior da página
}

function reloadPage() {
    location.reload();
}