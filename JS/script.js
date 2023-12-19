const apiUrl = 'https://rickandmortyapi.com/api/character'
let currentPage = 1
let totalPages = 1

async function getCharacters(page = 1) {
    try {
        const response = await axios.get(`${apiUrl}?page=${page}`)
        const charactersWithEpisodes = await Promise.all(
            response.data.results.map(async character => {
                const episodes = await Promise.all(
                    character.episode.map(async episodeUrl => {
                        const episodeResponse = await axios.get(episodeUrl)
                        return episodeResponse.data
                        })
                    )
            character.lastEpisode = episodes.reduce((latest, current) => 
                new Date(current.air_date) > new Date(latest.air_date) ? current : latest).name
            return character
        })
        )

        totalPages = response.data.info.pages

        return { ...response.data, results: charactersWithEpisodes }
    } catch (error) {
        console.error('Error fetching characters:', error)
    }
}

function displayCharacters(characters) {
    const characterList = document.getElementById('character-list')
    characterList.innerHTML = characters.results.map(character => `
        <div class="character-card">
            <img src="${character.image}" class="character-image" alt="${character.name}">
            <div class="character-description">
                <p>${character.id}</p>
                <h2>${character.name}</h2>
                <div class="status">
                    <div class="status-indicator" style="background-color: ${getStatusColor(character.status)}"></div>
                    <span>${character.status} - ${character.species}</span>
                </div>
                <p>Última localização conhecida: ${character.location.name}</p>
                <p>Visto pela última vez em: ${character.lastEpisode}</p>
            </div>
        </div> 
    `).join('')
}

function getStatusColor(status) {
    switch (status) {
        case 'Alive':
            return 'green'
        case 'Dead':
            return 'red'
        default:
            return 'gray'
    }
}

function displayPagination() {
    const paginationContainer = document.getElementById('pagination')
    const buttonAnteriorHTML = currentPage > 1 ? `<button onclick="changePage(${currentPage - 1})">${currentPage - 1}</button>` : ''
    const buttonAtualHTML = `<button style="background-color: gray" class="current-page">${currentPage}</button>`
    const buttonPosteriorHTML = currentPage < totalPages ? `<button onclick="changePage(${currentPage + 1})">${currentPage + 1}</button>` : ''
    const buttonFinalHTML = currentPage + 1 === totalPages || currentPage === totalPages ? '' : `
        <span>...</span>
        <button onclick="changePage(${totalPages})">${totalPages}</button>
    `
    paginationContainer.innerHTML = `${buttonAnteriorHTML}${buttonAtualHTML}${buttonPosteriorHTML}${buttonFinalHTML}`
}

async function fetchAndDisplayCharacters(page) {
    const charactersData = await getCharacters(page)
    currentPage = page
        displayCharacters(charactersData)
        displayPagination()
        fetchApiInfo()
}

        

async function searchCharacters() {
    const searchTerm = document.getElementById('search-input').value.trim()
    if (searchTerm === '') {
        fetchAndDisplayCharacters(1)
    } else {
        try {
            const response = await axios.get(`${apiUrl}?name=${searchTerm}`)
            const searchData = { ...response.data, results: response.data.results.map(character => ({ ...character, lastEpisode: '' })) }
            currentPage = 1
            totalPages = 1
            displayCharacters(searchData)
            displayPagination()
        } catch (error) {
            console.error('Error searching characters:', error)
        }
    }
}

async function fetchApiInfo() {
    try {
        const [charactersData, locationsData, episodesData] = await Promise.all([
            axios.get('https://rickandmortyapi.com/api/character'),
            axios.get('https://rickandmortyapi.com/api/location'),
            axios.get('https://rickandmortyapi.com/api/episode')
        ])
        const apiInfoContainer = document.getElementById('api-info')
            apiInfoContainer.innerHTML = `
                <p>Total de Personagens: ${charactersData.data.info.count}</p>
                <p>Total de Localizações: ${locationsData.data.info.count}</p>
                <p>Total de Episódios: ${episodesData.data.info.count}</p>
                <p>Desenvolvido por BernardoDartora em 2023</p>
            `
    } catch (error) {
        console.error('Error fetching API info:', error)
    }
}

function changePage(newPage) {
    if (newPage >= 1 && newPage <= totalPages) {
        fetchAndDisplayCharacters(newPage)
    }
}

function reloadPage() {
    location.reload()
}

function obs(){
        location.href = `https://www.adorocinema.com/series/serie-11561/criticas/`
}

fetchAndDisplayCharacters(1)