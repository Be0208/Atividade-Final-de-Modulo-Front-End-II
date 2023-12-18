const characterList = document.getElementById('character-list')
        const paginationContainer = document.getElementById('pagination')
        const apiUrl = 'https://rickandmortyapi.com/api/character'
        let currentPage = 1
        let totalPages = 1

        async function getCharacters(page = 1) {
            const response = await fetch(`${apiUrl}?page=${page}`)
            const data = await response.json()

            const charactersWithEpisodes = await Promise.all(
                data.results.map(async character => {
                    const episodeResponse = await fetch(character.episode[0])
                    const episodeData = await episodeResponse.json()
                    character.lastEpisode = episodeData.name
                    return character
                })
            )

            totalPages = data.info.pages
            return { ...data, results: charactersWithEpisodes }
        }

        function displayCharacters(characters) {
            characterList.innerHTML = ''
        
            characters.results.forEach(character => {
                const characterCard = document.createElement('div')
                characterCard.classList.add('character-card')
        
                // Adiciona a lógica para definir a cor da indicação de status
                let statusColor = ''
                switch (character.status) {
                    case 'Alive':
                        statusColor = 'green'
                        break
                    case 'Dead':
                        statusColor = 'red'
                        break
                    default:
                        statusColor = 'gray'
                }
                characterCard.innerHTML = `
                    <img src="${character.image}" class="character-image" alt="${character.name}">
                    <div class="character-description">
                        <p>${character.id}</p>
                        <h2>${character.name}</h2>
                        <div class="status">
                            <div class="status-indicator" id="status-indicator"></div>
                            <span>${character.status} - ${character.species}</span>
                        </div>
                        <p>Última localização conhecida: ${character.location.name}</p>
                        <p>Visto pela última vez em: ${character.lastEpisode}</p>
                    </div>
                `
                characterList.appendChild(characterCard)
            })
        }

        function displayPagination() {
            paginationContainer.innerHTML = ''

            const buttonAnteriorHTML = currentPage > 1 ? `<button id="btn-anterior" onclick=changePage(${currentPage - 1})> ${currentPage - 1} </button>` : ''
            const buttonAtualHTML = `<button style="background-color: gray " class="current-page">${currentPage}</button>`
            const buttonPosteriorHTML = currentPage < totalPages ? `<button id="btn-posterior" onclick=changePage(${currentPage + 1})> ${currentPage + 1} </button>` : ''
            const buttonFinalHTML = currentPage + 1 === totalPages || currentPage === totalPages ? '' : `
                <span>...</span>
                <button id="btn-posterior" onclick=changePage(${totalPages})> ${totalPages} </button>
            `

            paginationContainer.innerHTML = `
                ${buttonAnteriorHTML}
                ${buttonAtualHTML}
                ${buttonPosteriorHTML}
                ${buttonFinalHTML}
            `
        }

        async function fetchAndDisplayCharacters(page) {
            const charactersData = await getCharacters(page)

            currentPage = page
            displayCharacters(charactersData)
            displayPagination()
            fetchApiInfo()
        }

        // Carregar personagens da primeira página ao carregar a página
        fetchAndDisplayCharacters(1)

        const searchInput = document.getElementById('search-input')

        async function searchCharacters() {
            const searchTerm = searchInput.value.trim()
            if (searchTerm === '') {
                fetchAndDisplayCharacters(1)
            } else {
                const response = await fetch(`${apiUrl}?name=${searchTerm}`)
                const searchData = await response.json()
                displayCharacters(searchData)
            }
        }

        async function fetchApiInfo() {
            const charactersResponse = await fetch('https://rickandmortyapi.com/api/character')
            const charactersData = await charactersResponse.json()

            const locationsResponse = await fetch('https://rickandmortyapi.com/api/location')
            const locationsData = await locationsResponse.json()

            const episodesResponse = await fetch('https://rickandmortyapi.com/api/episode')
            const episodesData = await episodesResponse.json()

            const apiInfoContainer = document.getElementById('api-info')
            apiInfoContainer.innerHTML = `
                <p>Total de Personagens: ${charactersData.info.count}</p>
                <p>Total de Localizações: ${locationsData.info.count}</p>
                <p>Total de Episódios: ${episodesData.info.count}</p>
                <p>Desenvolvido por BernardoDartora em 2023</p>
            `
        }

        function changePage(newPage) {
            if (newPage >= 1 && newPage <= totalPages) {
                fetchAndDisplayCharacters(newPage)
            }
        }

        function reloadPage() {
            location.reload()
        }